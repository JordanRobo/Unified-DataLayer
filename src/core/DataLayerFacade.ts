import { pushDataLayerEvent } from "../index";
import { cleanValue, formatProduct } from "./utils/cleanValue";
import { Cart, DataLayerEvent, Product, ProductFilter } from "../types";

/**
 * DataLayerHelper - A simplified interface for common data layer events
 *
 * This class provides pre-configured methods for common tracking scenarios,
 * reducing boilerplate and ensuring consistency across implementations.
 */
export class DataLayerHelper {
	/**
	 * Track a home page view
	 * @param customData - Optional additional data to include
	 */
	static homeView(customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("page_default", {
			default: {
				page: {
					type: "home",
					action: "view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					...customData,
				},
			},
		});
	}

	/**
	 * Creates a data layer event for product listing views with formatted product data
	 * 
	 * This method takes an array of products, formats each one using the formatProduct function,
	 * adds positional information, and returns a structured data layer event. It's designed to
	 * work in both browser and server environments.
	 * 
	 * @param {Product[]} productsArray - Array of product objects to be formatted and tracked
	 * @param {string} [listName] - Optional name of the product list. Defaults to the last segment of the URL path
	 * @param {Record<string, any>} [customData={}] - Optional additional data to include in the page object
	 * 
	 * @returns {DataLayerEvent} A formatted data layer event object for product listing views
	 * 
	 * @example
	 * // Basic usage with just products
	 * const products = [
	 *   {
	 *     brand: "Nike",
	 *     category: "Footwear",
	 *     child_sku: "ABC123",
	 *     color: "Black|White",
	 *     discount: 20,
	 *     feature: ["Lightweight", "Cushioned"],
	 *     full_price: 120,
	 *     gender: "Men",
	 *     is_markdown: true,
	 *     listed_price: "100",
	 *     model: "Air Max",
	 *     name: "Air Max 270",
	 *     parent_category: "Shoes",
	 *     parent_sku: "XYZ789",
	 *     rating: 4.5
	 *   }
	 * ];
	 * 
	 * const event = DLManager.productListingView(products);
	 * 
	 * // With custom list name and additional data
	 * const customEvent = DLManager.productListingView(
	 *   products,
	 *   "featured-products",
	 *   { source: "homepage", campaign: "summer-sale" }
	 * );
	 */
	static plpView(productsArray: Product[], listName?: string, customData: Record<string, any> = {}): DataLayerEvent {
		const list_name = listName || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");
		const products = productsArray.map((product, i) => ({
			position: i,
			...formatProduct(product)
		}));

		return pushDataLayerEvent("product_listing-view", {
			default: {
				page: {
					type: "product",
					action: "listing-view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					list_name,
					...customData,
				},
			},
			products
		});
	}

	static plpFilter(filterData: ProductFilter ,customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("product_listing-filters", {
			default: {
				page: {
					type: "product",
					action: "listing-view",
					...customData,
				},
			},
			list_filters: filterData
		});
	}

	static plpSort(option: string, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("product_listing-sort", {
			default: {
				page: {
					type: "product",
					action: "listing-sort",
					...customData,
				},
			},
			list_sort: {
				option
			}
		});
	}

	/**
	 * Track a product detail page view
	 * @param {Product} productData - Product information
	 * @param customData - Optional additional data to include
	 */
	static pdpView(productData: Product, customData: Record<string, any> = {}): DataLayerEvent {
		const cleanProduct = formatProduct(productData);

		return pushDataLayerEvent("product_view", {
			default: {
				page: {
					type: "product",
					action: "view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					...customData,
				},
			}, 
			product: [ cleanProduct ],
		});
	}

	static pdpColorSelect(color: string, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("product_color-select", {
			default: {
				page: {
					type: "product",
					action: "color-select",
					...customData,
				},
			},
			product: [{ color }],
		});
	}

	static pdpSizeSelect(size: string, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("product_size-select", {
			default: {
				page: {
					type: "product",
					action: "size-select",
					...customData,
				},
			},
			product: [{ size }],
		});
	}

	/**
	 * Track an add to cart event
	 * @param productData - Product information
	 * @param quantity - Quantity added to cart
	 * @param customData - Optional additional data to include
	 */
	static cartAdd(productData: Product[], quantity: number, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("cart_add", {
			default: {
				page: {
					type: "cart",
					action: "add",
					name: "add-to-cart"
				}
			},
			cart_items: [{
				...productData,
				quantity,
			}],
			...customData,
		});
	}

	static cartViewMini(productData: Product[], cartData: Cart, quantity: number, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("cart_view-mini", {
			default: {
				page: {
					type: "cart",
					action: "view-mini"
				}
			},
			cart: {
				...cartData
			},
			cart_items: [{
				...productData,
				quantity,
			}],
			...customData,
		});
	}

	static cartViewFull(productData: Product[], cartData: Cart, quantity: number, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("cart_view-full", {
			default: {
				page: {
					type: "cart",
					action: "view-full"
				}
			},
			cart: {
				...cartData
			},
			cart_items: [{
				...productData,
				quantity,
			}],
			...customData,
		});
	}

	static cartRemove(productData: Product[], cartData: Cart, quantity: number, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("cart_remove", {
			default: {
				page: {
					type: "cart",
					action: "remove"
				}
			},
			cart_item_removed: {},
			cart: {
				...cartData
			},
			cart_items: [{
				...productData,
				quantity,
			}],
			...customData,
		});
	}

	/**
	 * Track a checkout step
	 * @param step - Checkout step number
	 * @param option - Optional checkout option (e.g., "Visa", "Home Delivery")
	 * @param customData - Optional additional data to include
	 */
	static checkoutStep(step: number, option?: string, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("checkout", {
			ecommerce: {
				checkout: {
					actionField: {
						step,
						option,
					},
				},
			},
			...customData,
		});
	}

	/**
	 * Track a user login event
	 * @param method - Login method (e.g., "email", "facebook")
	 * @param customData - Optional additional data to include
	 */
	static userLogin(method: string, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("user_login", {
			user: {
				login_method: method,
				...customData,
			},
		});
	}

	/**
	 * Track a page view for any page type
	 * @param pageType - Type of page (e.g., "category", "search", "checkout")
	 * @param customData - Optional additional data to include
	 */
	static pageView(pageType: string, action: string = "view", customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("page_default", {
			default: {
				page: {
					type: pageType,
					action: action,
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					...customData,
				},
			},
		});
	}

	/**
	 * Track a form submission
	 * @param formName - Name of the form
	 * @param formData - Optional form data to include
	 * @param customData - Optional additional data to include
	 */
	static formSubmit(formName: string, formData: Record<string, any> = {}, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("form_submit", {
			form: {
				name: formName,
				...formData,
			},
			...customData,
		});
	}

	/**
	 * Track a search event
	 * @param searchTerm - Search term
	 * @param resultsCount - Number of search results
	 * @param customData - Optional additional data to include
	 */
	static search(searchTerm: string, resultsCount: number, customData: Record<string, any> = {}): DataLayerEvent {
		return pushDataLayerEvent("site_search", {
			search: {
				term: searchTerm,
				results: resultsCount,
			},
			...customData,
		});
	}

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
export default DataLayerHelper;
