import { get } from "svelte/store";
import { DLManager } from "../core/DataLayerFacade";
import { dataLayerEvents, currentPage, currentProduct } from "./stores";
import { DataLayerEvent, pushDataLayerEvent } from "../index";
export * from "../types";
/**
 * SvelteDLManager - Svelte-specific implementation of DataLayerFacade
 *
 * This class integrates with Svelte's reactivity system and provides
 * methods that update Svelte stores.
 */
export class SvelteDLManager {
	/**
	 * Track a home page view
	 * @param customData - Optional additional data to include
	 */
	static homeView(customData: Record<string, any> = {}): DataLayerEvent {
		// Call the core functionality
		const event = DLManager.homeView(customData);

		// Update Svelte stores
		currentPage.set({
			type: "home",
			action: "view",
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Add to events store
		const events = get(dataLayerEvents);
		dataLayerEvents.set([...events, event]);

		return event;
	}

	/**
	 * Track a product listing page view
	 * @param listName - Optional name of the product list
	 * @param customData - Optional additional data to include
	 */
	static productListingView(listName?: string, customData: Record<string, any> = {}): DataLayerEvent {
		// Call the core functionality
		const event = DLManager.productListingView(listName, customData);

		// Update Svelte stores
		currentPage.set({
			type: "product",
			action: "listing-view",
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Reset current product since we're on a listing page
		currentProduct.set(null);

		// Add to events store
		const events = get(dataLayerEvents);
		dataLayerEvents.set([...events, event]);

		return event;
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
		// Call the core functionality
		const event = DLManager.productView(productData, customData);

		// Update Svelte stores
		currentPage.set({
			type: "product",
			action: "detail-view",
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Set current product
		currentProduct.set(productData);

		// Add to events store
		const events = get(dataLayerEvents);
		dataLayerEvents.set([...events, event]);

		return event;
	}

	/**
	 * Track any event and update Svelte stores
	 * @param eventName - Name of the event
	 * @param eventData - Event data
	 */
	static trackEvent(eventName: string, eventData: Record<string, any> = {}): DataLayerEvent {
		// Push to data layer
		const event = pushDataLayerEvent(eventName, eventData);

		// Add to events store
		const events = get(dataLayerEvents);
		dataLayerEvents.set([...events, event]);

		return event;
	}
}

// Also export the vanilla DLManager for direct access
export { DLManager };
