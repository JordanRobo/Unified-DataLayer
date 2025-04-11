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
	available_size?: string[];
	barcode?: string;
	brand: string;
	category: string[];
	child_sku: string;
	color: string;
	discount: number;
	feature: string[];
	full_price: number;
	gender: string;
	is_markdown: boolean;
	listed_price: number;
	model: string;
	name: string;
	parent_category: string;
	parent_sku: string;
	rating: number;
	reward_points?: number;
	size?: string;
	sku_available?: boolean;
	sku_by_size?: string;
	speciality?: string;
	sport?: string;
	story?: string;
	[key: string]: any;
}

export interface Product {
	available_size: string[];
	barcode: string;
	brand: string;
	category: string;
	child_sku: string;
	color: string;
	discount: number;
	feature: string[];
	full_price: number;
	gender: string;
	is_markdown: boolean;
	listed_price: number;
	model: string;
	name: string;
	parent_category: string;
	parent_sku: string;
	rating: number;
	reward_points: number;
	size: string;
	sku_available: boolean;
	sku_by_size: string;
	speciality: string;
	sport: string;
	story: string;
}
