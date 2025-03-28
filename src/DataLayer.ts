import { AccountImpl, AccountMod } from "./modules/Account";
import { CartImpl, CartMod } from "./modules/Cart";
import { CheckoutImpl, CheckoutMod } from "./modules/Checkout";
import { PageMod, PageImpl } from "./modules/Page";
import { ProductDisplayMod, ProductDisplayImpl } from "./modules/ProductDisplay";
import { ProductListingImpl, ProductListingMod } from "./modules/ProductListing";
import { WishlistImpl, WishlistMod } from "./modules/Wishlist";
import type { DataLayerConfig, EventData } from "./types";

/**
 * DataLayer - A unified interface for managing data layer events
 *
 * This class provides access to various modules for common tracking scenarios
 * and handles the core data layer functionality including initialization and event pushing.
 */
class DataLayer {
	private static instance: DataLayer | null = null;
	private config: DataLayerConfig | null = null;
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
	 * Constructor initializes the data layer and all modules
	 */
	private constructor() {
		if (typeof window !== "undefined") {
			// Initialize the Adobe Data Layer if it doesn't exist
			window.adobeDataLayer = window.adobeDataLayer || [];
			this.dataLayer = window.adobeDataLayer;
		}

		// Initialize all modules
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
	 * Initialize the DataLayer with configuration options
	 * @param options Configuration options including required site information
	 * @throws Error if siteInfo is not provided
	 */
	public init(options: DataLayerConfig): void {
		// Validate that siteInfo is provided
		if (!options.siteInfo) {
			throw new Error("DataLayer initialization failed: siteInfo is required");
		}

		this.config = options;
	}

	/**
	 * Pushes an event to the Adobe Data Layer with properly formatted data
	 * @param eventName The name of the event
	 * @param eventData Object containing the event data
	 * @returns The complete event object that was pushed
	 * @throws Error if DataLayer has not been initialized with siteInfo
	 */
	public pushEvent(eventName: string, eventData: EventData = {}): void {
		// Check if DataLayer has been initialized with proper config
		if (this.isFirstEventAfterRefresh && (!this.config || !this.config.siteInfo)) {
			throw new Error("DataLayer not initialized: Call DataLayer.init({siteInfo: {...}}) before pushing events");
		}

		if (typeof window === "undefined") {
			// In a non-browser environment, we just log and return
			console.log(`Event would be pushed: ${eventName}`, eventData);
			return;
		}

		const dataToSend = { ...eventData };

		// Add site info to the first event after page refresh
		if (this.isFirstEventAfterRefresh && this.config) {
			dataToSend.default = dataToSend.default || {};
			dataToSend.default.site = this.config.siteInfo;
			this.isFirstEventAfterRefresh = false;
		}

		// Create the event object
		const eventObj: any = {
			event: eventName,
			...dataToSend,
		};

		// Handle smart nullification of properties from previous events
		if (this.previousEvent) {
			Object.keys(this.previousEvent).forEach((key) => {
				if (key === "event") return;

				if (key === "default") {
					if (typeof this.previousEvent[key] === "object" && this.previousEvent[key] !== null && !Array.isArray(this.previousEvent[key])) {
						if (!(key in eventObj) || typeof eventObj[key] !== "object" || eventObj[key] === null) {
							eventObj[key] = {};
						}

						const propertiesToCheck = this.propertiesToNullify[key] || [];
						propertiesToCheck.forEach((nestedKey) => {
							if (
								typeof eventObj[key] === "object" &&
								eventObj[key] !== null &&
								nestedKey in this.previousEvent[key] &&
								typeof this.previousEvent[key] === "object" &&
								this.previousEvent[key] !== null &&
								!(nestedKey in (eventObj[key] as Record<string, any>))
							) {
								(eventObj[key] as Record<string, any>)[nestedKey] = null;
							}
						});
					}
				} else if (!(key in eventObj)) {
					eventObj[key] = null;
				}
			});
		}

		// Push the event to the data layer
		this.dataLayer.push(eventObj);

		// Store the event for future nullification
		this.previousEvent = JSON.parse(JSON.stringify(eventObj));
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
	 * @param properties Map of object keys to arrays of properties to nullify
	 */
	public setPropertiesToNullify(properties: Record<string, string[]>): void {
		this.propertiesToNullify = properties;
	}

	/**
	 * Add properties to nullify for a specific object key
	 * @param key The object key (e.g., 'default')
	 * @param properties Array of property names to nullify
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
