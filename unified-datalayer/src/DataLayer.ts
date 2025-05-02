import { AccountImpl, AccountMod } from "./modules/Account";
import { CartImpl, CartMod } from "./modules/Cart";
import { CheckoutImpl, CheckoutMod } from "./modules/Checkout";
import { PageMod, PageImpl } from "./modules/Page";
import { ProductDisplayMod, ProductDisplayImpl } from "./modules/ProductDisplay";
import { ProductListingImpl, ProductListingMod } from "./modules/ProductListing";
import { WishlistImpl, WishlistMod } from "./modules/Wishlist";
import type { DataLayerConfig, EventData, UserInfo } from "./types";

/**
 * DataLayer - A unified interface for managing data layer events
 *
 * This class provides access to various modules for common tracking scenarios
 * and handles the core data layer functionality including initialisation, smart nullification and event pushing.
 */
class DataLayer {
	private static instance: DataLayer | null = null;
	private config: DataLayerConfig | null = null;
	private user: UserInfo | null = null;
	private isFirstEventAfterRefresh = true;
	private dataLayer: any[] = [];
	private previousEvent: any | null = null;
	private propertiesToNullify: Record<string, string[]> = {
		default: ["error"],
	};

	// Module instances
	public page: PageMod;
	public pdp: ProductDisplayMod;
	public plp: ProductListingMod;
	public cart: CartMod;
	public checkout: CheckoutMod;
	public account: AccountMod;
	public wishlist: WishlistMod;

	/**
	 * Constructor initialises the data layer and all modules
	 */
	private constructor() {
		if (typeof window !== "undefined") {
			window.adobeDataLayer = window.adobeDataLayer || [];
			this.dataLayer = window.adobeDataLayer;
		}

		this.page = new PageImpl(this);
		this.pdp = new ProductDisplayImpl(this);
		this.plp = new ProductListingImpl(this);
		this.cart = new CartImpl(this);
		this.checkout = new CheckoutImpl(this);
		this.account = new AccountImpl(this);
		this.wishlist = new WishlistImpl(this);
	}

	/**
	 * Get the singleton instance of DataLayer
	 */
	public static getInstance(): DataLayer {
		if (!DataLayer.instance) {
			DataLayer.instance = new DataLayer();
		}
		return DataLayer.instance;
	}

	/**
	 * Initialise the DataLayer with configuration options
	 * @param {DataLayerConfig} options Configuration options including required site information
	 * @throws Error if siteInfo is not provided
	 * @example 
	 * const dl = getDataLayer();
	 * 
	 * dl.init({
	 * 	siteInfo: {
	 * 		name: "my-site",
	 * 		experience: "desktop",
	 * 		currency: "AUD",
	 * 		division: "myCompany",
	 * 		domain: "www.my-site.com.au",
	 * 		env: "prod",
	 * 		version: "4.2.0"
	 * 	}
	 * });
	 */
	public init(options: DataLayerConfig): void {
		if (!options.siteInfo) {
			throw new Error("DataLayer initialisation failed: siteInfo is required");
		}

		this.config = options;
		
		if (typeof window !== "undefined") {
			this.user = {
				user_state: window.localStorage.getItem("uem_hashed") ? "customer" : "guest",
				login_state: window.localStorage.getItem("uem_hashed") ? "logged-in" : "anonymous",
				uem_hashed: window.localStorage.getItem("uem_hashed") ?? "",
				session_id: "",
				division_id: ""
			};
		}
	}

	/**
	 * Pushes an event to the Adobe Data Layer with properly formatted data
	 * @param eventName The name of the event
	 * @param eventData Object containing the event data
	 * @throws Error if DataLayer has not been initialised with siteInfo
	 */
	public pushEvent(eventName: string, eventData: EventData = {}): void {
		this.validateInitialisation();

		if (typeof window === "undefined") {
			console.log(`Event would be pushed: ${eventName}`, eventData);
			return;
		}

		const eventObj = this.prepareEventObject(eventName, eventData);

		this.applyNullificationLogic(eventObj);
		this.dataLayer.push(eventObj);
		this.storeCleanPreviousEvent(eventObj);
	}

	public clearProducts(): void {
		this.dataLayer.push({products: null})
	}

	/**
	 * Validates that the DataLayer is properly initialised
	 * @private
	 */
	private validateInitialisation(): void {
		if (this.isFirstEventAfterRefresh && (!this.config || !this.config.siteInfo)) {
			throw new Error("DataLayer not initialised: Call DataLayer.init({siteInfo: {...}}) before pushing events");
		}
	}

	/**
	 * Prepares the event object with all necessary data
	 * @private
	 */
	private prepareEventObject(eventName: string, eventData: EventData): any {
		const dataToSend = { ...eventData };

		if (this.isFirstEventAfterRefresh && this.config) {
			dataToSend.default = dataToSend.default || {};
			dataToSend.default.site = this.config.siteInfo;
			if (this.user) {
				dataToSend.default.user = this.user;
			}
			this.isFirstEventAfterRefresh = false;
		}

		return {
			event: eventName,
			...dataToSend,
		};
	}

	/**
	 * Applies nullification logic to track state changes between events
	 * @private
	 */
	private applyNullificationLogic(eventObj: any): void {
		if (!this.previousEvent) return;

		Object.keys(this.previousEvent).forEach((key) => {
			if (key === "event") return;

			if (key === "default") {
				this.handleDefaultObjectNullification(eventObj, key);
			} else if (!(key in eventObj)) {
				eventObj[key] = null;
			}
		});
	}

	/**
	 * Handles nullification for nested properties in the 'default' object
	 * @private
	 */
	private handleDefaultObjectNullification(eventObj: any, key: string): void {
		const prevValue = this.previousEvent?.[key];

		if (typeof prevValue !== "object" || prevValue === null || Array.isArray(prevValue)) {
			return;
		}

		if (!(key in eventObj) || typeof eventObj[key] !== "object" || eventObj[key] === null) {
			eventObj[key] = {};
		}

		const propertiesToCheck = this.propertiesToNullify[key] || [];

		propertiesToCheck.forEach((nestedKey) => {
			const shouldNullify =
				typeof eventObj[key] === "object" &&
				eventObj[key] !== null &&
				nestedKey in prevValue &&
				!(nestedKey in eventObj[key]);

			if (shouldNullify) {
				eventObj[key][nestedKey] = null;
			}
		});
	}

	/**
	 * Stores a clean version of the event as previousEvent by removing nullified properties
	 * @private
	 */
	private storeCleanPreviousEvent(eventObj: any): void {
		const cleanEvent = JSON.parse(JSON.stringify(eventObj));

		Object.keys(cleanEvent).forEach(key => {
			if (key !== "default" && cleanEvent[key] === null) {
				delete cleanEvent[key];
			}
		});

		if (cleanEvent.default && typeof cleanEvent.default === "object") {
			Object.keys(cleanEvent.default).forEach(nestedKey => {
				if (cleanEvent.default[nestedKey] === null) {
					delete cleanEvent.default[nestedKey];
				}
			});
		}

		this.previousEvent = cleanEvent;
	}

	/**
	 * Reset the first event flag - useful for testing or when you need to force
	 * the site information to be sent again
	 */
	public resetFirstEventFlag(): void {
		this.isFirstEventAfterRefresh = true;
	}

	/**
	 * Configure properties that should be automatically nullified
	 * @param properties - Map of object keys to arrays of properties to nullify
	 */
	public setPropertiesToNullify(properties: Record<string, string[]>): void {
		this.propertiesToNullify = properties;
	}

	/**
	 * Add properties to nullify for a specific object key
	 * @param key - The object key (e.g., 'default')
	 * @param properties - Array of property names to nullify
	 */
	public addPropertiesToNullify(key: string, properties: string[]): void {
		this.propertiesToNullify[key] = [...(this.propertiesToNullify[key] || []), ...properties];
	}
}

// Export the class and a factory function for easy access
export default DataLayer;

// Factory function to get an instance of the DataLayer
export function getDataLayer(): DataLayer {
	return DataLayer.getInstance();
}
