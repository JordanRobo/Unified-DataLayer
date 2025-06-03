declare global {
	interface Window {
		adobeDataLayer: any[];
	}
}

export interface UserInfo {
	user_state: string;
	login_state: string;
	uem_hashed: string;
	session_id: string;
	division_id: string;
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

/**
 * Required input data for Products
 * 
 * This interface defines the core properties that must be provided for every product.
 * All properties are required and represent the minimum data needed for product tracking.
 */
export interface ProductData {
	/**
	 * The brand of the product
	 * 
	 * @example "asics"
	 */
	brand: string;

	/**
	 * The category to which the product belongs, as an array of category names
	 * 
	 * @example ["womens", "run"]
	 */
	category: string[];

	/**
	 * Child SKU id
	 * 
	 * @example "1012A026-101"
	 */
	child_sku: string;

	/**
	 * The color of the product
	 * 
	 * @example "blue"
	 */
	color: string;

	/**
	 * Full price (inclusive of GST) of the product
	 * 
	 * @example 259.99
	 */
	full_price: number;

	/**
	 * The gender to which the product is marketed as
	 * 
	 * @example "women"
	 */
	gender: string;

	/**
	 * Current listed price (inclusive of GST) of the product
	 * 
	 * @example 189.99
	 */
	listed_price: number;

	/**
	 * Friendly name of the product
	 * 
	 * @example "asics-gel-kayano-25-womens-skylight-illusion-blue"
	 */
	name: string;

	/**
	 * Parent category of the product
	 * Must be one of: footwear, accessories, or apparel
	 * 
	 * @example "footwear"
	 */
	parent_category: string;

	/**
	 * Parent level SKU id
	 * 
	 * @example "1012A026"
	 */
	parent_sku: string;

	/**
	 * Whether the current product is IN STOCK and AVAILABLE
	 * 
	 * @example true
	 */
	sku_available: boolean;

	[key: string]: any;
}

/**
 * Cart-specific product data
 * 
 * Extends ProductData with additional required fields specific to cart operations.
 * Used when tracking products that have been added to the cart, where size selection
 * and quantity are mandatory.
 */
export interface CartProductData extends ProductData {
	/**
	 * The number of product items added to the cart
	 * Required for cart operations
	 * 
	 * @example 1
	 */
	qty: number;

	/**
	 * The selected size of the product
	 * Defaults to US sizing format
	 * Current deployment captures user's selected sizing chart (if EU is selected, size will be EU)
	 * 
	 * @example "8-us-mens"
	 */
	size: string;

	/**
	 * SKU by Size for the product
	 * Populated for cart, checkout and order success events
	 * 
	 * @example "23233"
	 */
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

/**
 * Additional Product input fields
 * 
 * While not required, these properties should be included wherever available
 * to provide richer product data for analytics and tracking purposes.
 */
export interface ProductOptions {
	/**
	 * All current available sizes in default size format (US size or kids size)
	 * 
	 * @example ["US-6", "US-7", "US-9.5"]
	 */
	available_size?: string[];

	/**
	 * Barcode of the product
	 * Should be populated whenever available
	 * 
	 * @example "1012Aasdf454asdfg101"
	 */
	barcode?: string;

	/**
	 * Current product features
	 * Examples include 'NEW', 'TEAM-PICK', '61% OFF' or 'SAVE 33'
	 * Should be populated whenever available
	 * 
	 * @example ["new", "team-pick"]
	 */
	feature?: string[];

	/**
	 * The model of the product
	 * Should be populated whenever available
	 * 
	 * @example "gel-kayano"
	 */
	model?: string;

	/**
	 * Product rating from the page
	 * Always passed as a number with one decimal point
	 * Should be populated whenever available
	 * 
	 * @example 4.3
	 */
	rating?: number;

	/**
	 * Reward points if available/listed for the product
	 * 
	 * @example 250
	 */
	reward_points?: number;

	/**
	 * The product specialty if available
	 * Should be populated whenever available
	 * 
	 * @example "run"
	 */
	specialty?: string;

	/**
	 * The sport the product belongs to
	 * Should be populated whenever available
	 * 
	 * @example "run"
	 */
	sport?: string;

	/**
	 * The story of the product
	 * Should be populated whenever available
	 * 
	 * @example "GEL-KAYANO-25"
	 */
	story?: string;
}