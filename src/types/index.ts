export interface Site {
	name: string;
	experience: string;
	currency: string;
	division: string;
	domain: string;
	env: string;
	version: string;
}

export interface Page {
	type: string;
	action: string;
	path: string;
	title: string;
	url: string;
	list_name?: string;
}

export interface User {
	user_state: string;
	login_status: string;
	uem_hashed: string;
	session_id: string;
	divison_id: string;
}

export interface Default {
	site?: Site;
	page?: Page;
	user?: User;
	error?: any;
}

export interface Cart {
	cartId: string;
	quoteId: string;
	cart_quantity: number;
	cart_total: number;
}

export interface Product {
	available_size?: string[];
	barcode?: string;
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
	reward_points?: number;
	size?: string;
	sku_available?: boolean;
	sku_by_size?: string;
	speciality?: string;
	sport?: string;
	story?: string;
}

export interface ProductFilter {
	filter_type: string;
	filter_value: string;
}

export interface DataLayerConfig {
	siteInfo?: Site;
}

export interface DataLayerEvent {
	event: string;
	default?: Default;
	cart?: Cart;
	cart_item_removed?: Product[];
	cart_items?: Product[];
	checkout_type?: string;
	products?: Product[];
	[key: string]: any;
}

// Declare window types for TypeScript
declare global {
	interface Window {
		adobeDataLayer: any[];
	}
}

