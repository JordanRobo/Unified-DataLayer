declare global {
	interface Window {
		adobeDataLayer: any[];
	}
}

/**
 * Configuration options for initialising the DataLayer
 */
export interface DataLayerConfig {
	/**
	 * Required site information details
	 */
	siteInfo: {
		/** Name of the site */
		name: string;

		/** Experience type (e.g., "desktop", "mobile") */
		experience: string;

		/** Currency code (e.g., "AUD", "NZD") */
		currency: string;

		/** Company division */
		division: string;

		/** Site domain */
		domain: string;

		/** Environment (e.g., "dev", "prod") */
		env: string;

		/** Site version */
		version: string;
	};
}

export interface EventData {
	[key: string]: any;
}

export interface ProductData {
	brand: string;
	category: string[];
	child_sku: string;
	color: string;
	discount: number;
	full_price: number;
	gender: string;
	is_markdown: boolean;
	listed_price: number;
	name: string;
	parent_category: string;
	parent_sku: string;
	sku_available: boolean;
	[key: string]: any;
}

export interface CartProductData extends ProductData {
	qty: number;
	size: string;
	sku_by_size: string;
}

export interface Cart_Product extends Product {
	qty: number;
	size: string;
	sku_by_size: string;
}

export interface Product extends BaseProduct, Partial<ProductOptions> { }

export interface BaseProduct {
	brand: string;
	category: string;
	child_sku: string;
	color: string;
	discount: number;
	full_price: number;
	gender: string;
	is_markdown: boolean;
	listed_price: number;
	name: string;
	parent_category: string;
	parent_sku: string;
	sku_available: boolean;
}

export interface ProductOptions {
	available_size?: string[];
	barcode?: string;
	feature?: string[];
	rating?: number;
	reward_points?: number;
	model?: string;
	speciality?: string;
	sport?: string;
	story?: string;
}