import type { User, Loyalty } from "./user";
import type { Page, Site, Cart, CartItem } from "./core";
import type { Product, ProductFilter, ProductParams } from "./product";

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
	siteInfo: Site;
}

interface EventParams {
	default?: Default;
	cart?: Cart;
	cart_item_removed?: Product[];
	cart_items?: Product[];
	checkout_type?: string;
	products?: Product[];
}

interface DataLayerEvent extends EventParams {
	event: string;
	
}

interface ProductEventParams extends EventParams {
	products: Product[]; 
}


export type { DataLayerConfig, EventParams, DataLayerEvent, ProductEventParams, Default };
export type { User, Loyalty, Page, Site, Cart, Product, ProductFilter, ProductParams, CartItem };