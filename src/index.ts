import DataLayerManager from "./core/DataLayerManager";
import DataLayer from "./core/DataLayer";
import type { DataLayerConfig, DataLayerEvent } from "./types";

export { DataLayerManager, DataLayer };

let dataLayerManagerInstance: DataLayerManager | null = null;

let isFirstEventAfterRefresh = true;
let config: DataLayerConfig = {};

/**
 * Initialize the Adobe Data Layer and DataLayerManager
 *
 * @param options - Configuration options for the data layer
 */
export const dataLayerInit = (options: DataLayerConfig = {}): void => {
	config = options;

	if (typeof window !== "undefined") {
		if (typeof window.adobeDataLayer === "undefined") {
			window.adobeDataLayer = [];
		}

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
	if (typeof window === "undefined") {
		return {
			event: eventName,
			...eventData,
		};
	}

	window.adobeDataLayer = window.adobeDataLayer || [];

	if (!dataLayerManagerInstance) {
		dataLayerManagerInstance = new DataLayerManager(window.adobeDataLayer);
	}

	const dataToSend = { ...eventData };

	if (isFirstEventAfterRefresh) {
		dataToSend.default = dataToSend.default || {};

		if (config.siteInfo) {
			dataToSend.default.site = config.siteInfo;
		}

		isFirstEventAfterRefresh = false;
	}

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
