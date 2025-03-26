import DataLayerManager from "./core/DataLayerManager";
import DataLayer from "./core/DataLayer";
import { DataLayerConfig, DataLayerEvent } from "./types";
export * from "./types";
export * from "./core/utils/cleanValue";

// Export the core classes
export { DataLayerManager, DataLayer };

// Create a singleton instance of the manager
let dataLayerManagerInstance: DataLayerManager | null = null;

// In-memory flag that will reset on page refresh
// This creates a module-level variable that persists during SPA navigation but resets on refresh
let isFirstEventAfterRefresh = true;
let config: DataLayerConfig = {};

/**
 * Initialize the Adobe Data Layer and DataLayerManager
 *
 * @param options - Configuration options for the data layer
 */
export const initializeDataLayer = (options: DataLayerConfig = {}): void => {
	// Store configuration
	config = options;

	// Only initialize if not already initialized
	if (typeof window !== "undefined") {
		if (typeof window.adobeDataLayer === "undefined") {
			window.adobeDataLayer = [];
		}

		// Initialize the DataLayerManager instance if not already done
		if (!dataLayerManagerInstance) {
			dataLayerManagerInstance = new DataLayerManager(window.adobeDataLayer);
		}
	}
};

/**
 * Pushes an event to the Adobe Data Layer with properly formatted data
 *
 * @param eventName - The name of the event (e.g., 'home_view', 'product_list_view')
 * @param eventData - Object containing the event data
 * @returns The complete event object that was pushed
 */
export const pushDataLayerEvent = (eventName: string, eventData: Record<string, any> = {}): DataLayerEvent => {
	// Early return if window is not available (SSR)
	if (typeof window === "undefined") {
		// Create a properly typed object with at least the event property
		return {
			event: eventName,
			...eventData,
		};
	}

	// Initialize Adobe Data Layer if it doesn't exist
	window.adobeDataLayer = window.adobeDataLayer || [];

	// Initialize the DataLayerManager instance if not already done
	if (!dataLayerManagerInstance) {
		dataLayerManagerInstance = new DataLayerManager(window.adobeDataLayer);
	}

	// Create a copy of the event data to avoid modifying the original
	const dataToSend = { ...eventData };

	// Check if this is the first event after page refresh
	if (isFirstEventAfterRefresh) {
		// Make sure default object exists
		dataToSend.default = dataToSend.default || {};

		// Add site info to the appropriate location in the structure
		if (config.siteInfo) {
			dataToSend.default.site = config.siteInfo;
		}

		// Mark first event as sent
		isFirstEventAfterRefresh = false;
	}

	// Use our DataLayerManager to push the event
	return dataLayerManagerInstance.pushEvent(eventName, dataToSend);
};

/**
 * Reset the first event flag - useful for testing or when you need to force
 * the site information to be sent again
 */
export const resetFirstEventFlag = (): void => {
	isFirstEventAfterRefresh = true;
};

/**
 * Access the underlying DataLayerManager instance
 * Useful for advanced configuration
 */
export const getDataLayerManager = (): DataLayerManager | null => {
	return dataLayerManagerInstance;
};
