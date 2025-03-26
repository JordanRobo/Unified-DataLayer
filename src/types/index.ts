import { Loyalty, User } from "./user";
import { Page, Site, Cart, CartItem } from "./core";
import { Product, ProductFilter } from "./product";

// Declare window types for TypeScript
declare global {
	interface Window {
		adobeDataLayer: any[];
	}
}

interface Default {
	site?: Site;
	page?: Page;
	user?: User;
	loyalty?: Loyalty;
	error?: any;
}

interface DataLayerConfig {
	siteInfo?: Site;
}

interface DataLayerEvent {
	event: string;
	default?: Default;
	cart?: Cart;
	cart_item_removed?: Product[];
	cart_items?: Product[];
	checkout_type?: string;
	products?: Product[];
	[key: string]: any;
}

export { Cart, CartItem, DataLayerConfig, DataLayerEvent, Default, Loyalty, Page, Product, ProductFilter, Site, User };
