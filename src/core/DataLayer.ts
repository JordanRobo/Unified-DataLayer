import { pushDataLayerEvent } from "../index";
import type { DataLayerEvent } from "../types";
import { CartModule, CheckoutModule, PageModule, ProductDisplayModule, ProductListingModule, WishlistModule } from "./modules";

/**
 * DataLayer - A simplified interface for common data layer events
 *
 * This class provides pre-configured methods for common tracking scenarios,
 * reducing boilerplate and ensuring consistency across implementations.
 */
class DataLayer {
	static page = PageModule;
	static cart = CartModule;
	static pdp = ProductDisplayModule;
	static plp = ProductListingModule;
	static checkout = CheckoutModule;
	static wishlist = WishlistModule;

	/**
	 * Track a custom event
	 * @param eventName - Name of the event
	 * @param eventData - Event data
	 */
	static custom(eventName: string, eventData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent(eventName, eventData);
	}
}

// Export a convenient alias
export default DataLayer;
