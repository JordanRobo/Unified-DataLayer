import { useEffect } from "react";
import { DLManager } from "../core/DataLayerFacade";

/**
 * ReactDLManager - React-specific implementation of the DataLayerFacade
 *
 * This class provides React hooks for easy integration with React components.
 */
export class ReactDLManager {
	/**
	 * Track a home page view
	 * @param customData - Optional additional data to include
	 * @param dependencies - Optional array of dependencies to trigger the effect
	 */
	static useHomeView(customData?: Record<string, any>, dependencies: any[] = []) {
		useEffect(() => {
			DLManager.homeView(customData);
		}, dependencies);
	}

	/**
	 * Track a product listing page view
	 * @param listName - Optional name of the product list
	 * @param customData - Optional additional data to include
	 * @param dependencies - Optional array of dependencies to trigger the effect
	 */
	static usePLPView(listName?: string, customData?: Record<string, any>, dependencies: any[] = []) {
		useEffect(() => {
			DLManager.productListingView(listName, customData);
		}, dependencies);
	}

	/**
	 * Track a product detail page view
	 * @param productData - Product information
	 * @param customData - Optional additional data to include
	 * @param dependencies - Optional array of dependencies to trigger the effect
	 */
	static usePDPView(
		productData: {
			id: string | number;
			name: string;
			price?: number;
			category?: string;
			[key: string]: any;
		},
		customData?: Record<string, any>,
		dependencies: any[] = [],
	) {
		useEffect(() => {
			DLManager.productView(productData, customData);
		}, dependencies);
	}

	/**
	 * Track a page view for any page type
	 * @param pageType - Type of page (e.g., "category", "search", "checkout")
	 * @param action - Action being performed (default: "view")
	 * @param customData - Optional additional data to include
	 * @param dependencies - Optional array of dependencies to trigger the effect
	 */
	static usePageView(pageType: string, action: string = "view", customData?: Record<string, any>, dependencies: any[] = []) {
		useEffect(() => {
			DLManager.pageView(pageType, action, customData);
		}, dependencies);
	}

	/**
	 * Hook for tracking an event when a user performs an action
	 * (Typically used with an event handler like onClick)
	 *
	 * @returns A function that can be called to track the event
	 *
	 * @example
	 * const trackAddToCart = ReactDLManager.useEventTracker(
	 *   (product, quantity = 1) => DLManager.addToCart(product, quantity)
	 * );
	 *
	 * // In your JSX:
	 * <button onClick={() => trackAddToCart(product, 2)}>Add to Cart</button>
	 */
	static useEventTracker<T extends (...args: any[]) => void>(trackingFunction: T): T {
		// Return a memoized version of the tracking function
		// This ensures the function reference doesn't change on re-renders
		return trackingFunction;
	}
}

// Create hooks for individual tracking scenarios for more idiomatic React usage
export const useHomeView = ReactDLManager.useHomeView;
export const usePLPView = ReactDLManager.usePLPView;
export const usePDPView = ReactDLManager.usePDPView;
export const usePageView = ReactDLManager.usePageView;
export const useEventTracker = ReactDLManager.useEventTracker;

// Also export the vanilla JS methods for direct access
export { DLManager };
