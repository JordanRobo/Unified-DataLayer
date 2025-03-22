import { pushDataLayerEvent } from "../index";
import { cleanValue } from "./utils/cleanValue";
import { DataLayerEvent } from "../types";

/**
 * DataLayerFacade - A simplified interface for common data layer events
 *
 * This class provides pre-configured methods for common tracking scenarios,
 * reducing boilerplate and ensuring consistency across implementations.
 */
export class DataLayerFacade {
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
	 * Track a product listing page view
	 * @param listName - Optional name of the product list
	 * @param customData - Optional additional data to include
	 */
	static productListingView(listName?: string, customData: Record<string, any> = {}): DataLayerEvent {
		const list_name = listName || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");

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
		});
	}

	/**
	 * Track a product detail page view
	 * @param productData - Product information
	 * @param customData - Optional additional data to include
	 */
	static productView(
		productData: {
			id: string | number;
			name: string;
			price?: number;
			category?: string;
			[key: string]: any;
		},
		customData: Record<string, any> = {},
	): DataLayerEvent {
		return pushDataLayerEvent("product_view", {
			default: {
				page: {
					type: "product",
					action: "detail-view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					...customData,
				},
			},
			product: productData,
		});
	}

	/**
	 * Track an add to cart event
	 * @param productData - Product information
	 * @param quantity - Quantity added to cart
	 * @param customData - Optional additional data to include
	 */
	static addToCart(
		productData: {
			id: string | number;
			name: string;
			price?: number;
			category?: string;
			[key: string]: any;
		},
		quantity: number = 1,
		customData: Record<string, any> = {},
	): DataLayerEvent {
		return pushDataLayerEvent("add_to_cart", {
			product: {
				...productData,
				quantity,
			},
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
export const DLManager = DataLayerFacade;
