import DataLayerManager from "./DataLayerManager";
import type { DataLayerConfig, DataLayerEvent, EventParams } from "../types";
import { AccountModule, CartModule, CheckoutModule, PageModule, ProductDisplayModule, ProductListingModule, WishlistModule } from "./modules";

/**
 * DataLayer - A simplified interface for common data layer events
 *
 * This class provides pre-configured methods for common tracking scenarios,
 * reducing boilerplate and ensuring consistency across implementations.
 */
class DataLayer {
	private static dataLayerManagerInstance: DataLayerManager | null = null;
	private static isFirstEventAfterRefresh = true;
	private static config: DataLayerConfig;

	static page = PageModule(DataLayer);
	static cart = CartModule(DataLayer);
	static pdp = ProductDisplayModule(DataLayer);
	static plp = ProductListingModule(DataLayer);
	static checkout = CheckoutModule(DataLayer);
	static wishlist = WishlistModule(DataLayer);
	static account = AccountModule(DataLayer);

	/**
	* Initialize the Adobe Data Layer and DataLayerManager
	*
	* @param options - Configuration options for the data layer including required siteInfo
	* @throws Error if siteInfo is not provided
	*/
	static init(options: DataLayerConfig): void {
		// Validate that siteInfo is provided
		if (!options.siteInfo) {
			throw new Error('DataLayer initialization failed: siteInfo is required');
		}

		this.config = options;

		if (typeof window !== "undefined") {
			if (typeof window.adobeDataLayer === "undefined") {
				window.adobeDataLayer = [];
			}

			if (!this.dataLayerManagerInstance) {
				this.dataLayerManagerInstance = new DataLayerManager(window.adobeDataLayer);
			}
		}
	}

	/**
	* Pushes an event to the Adobe Data Layer with properly formatted data
	*
	* @param eventName - The name of the event (e.g., 'home_view', 'product_list_view')
	* @param eventData - Object containing the event data
	* @returns The complete event object that was pushed
	* @throws Error if DataLayer has not been initialized with siteInfo
	*/
	static pushEvent(eventName: string, eventData: EventParams = {}): DataLayerEvent {
		// Check if DataLayer has been initialised with proper config
		if (this.isFirstEventAfterRefresh && (!this.config || !this.config.siteInfo)) {
			throw new Error('DataLayer not initialised: Call DataLayer.init({siteInfo: {...}}) before pushing events');
		}

		if (typeof window === "undefined") {
			return {
				event: eventName,
				...eventData,
			};
		}

		window.adobeDataLayer = window.adobeDataLayer || [];

		if (!this.dataLayerManagerInstance) {
			this.dataLayerManagerInstance = new DataLayerManager(window.adobeDataLayer);
		}

		const dataToSend = { ...eventData };

		if (this.isFirstEventAfterRefresh) {
			dataToSend.default = dataToSend.default || {};
			dataToSend.default.site = this.config.siteInfo;
			this.isFirstEventAfterRefresh = false;
		}

		return this.dataLayerManagerInstance.dataLayerPush(eventName, dataToSend);
	}

	/**
	 * Reset the first event flag - useful for testing or when you need to force
	 * the site information to be sent again
	 */
	static resetFirstEventFlag(): void {
		this.isFirstEventAfterRefresh = true;
	}

	/**
	 * Access the underlying DataLayerManager instance
	 * Useful for advanced configuration
	 */
	static getDataLayerManager(): DataLayerManager | null {
		return this.dataLayerManagerInstance;
	}

}

// Export a convenient alias
export default DataLayer;
