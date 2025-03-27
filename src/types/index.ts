import type { User, Loyalty } from "./user";
import type { Page, Site, Cart, CartItem } from "./core";
import type { Product, ProductFilter, ProductResp } from "./product";

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
}

export type { DataLayerConfig, DataLayerEvent, Default };
export type { User, Loyalty, Page, Site, Cart, Product, ProductFilter, ProductResp, CartItem };