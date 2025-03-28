declare global {
	interface Window {
		adobeDataLayer: any[];
	}
}

export interface DataLayerConfig {
	siteInfo: Site;
}

export interface EventData {
	[key: string]: any;
}

export interface Site {
	name: string;
	experience: string;
	currency: string;
	division: string;
	domain: string;
	env: string;
	version: string;
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
