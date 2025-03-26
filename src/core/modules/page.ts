import { pushDataLayerEvent, cleanValue } from "../..";
import type { DataLayerEvent } from "../..";

const pageModule = {
	/**
	 * Track a home page view
	 * @param customData - Optional additional data to include
	 */
	home: (customData: Record<string, any> = {}): DataLayerEvent => {
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
	},

	/**
	 * Track a page view for any page type
	 * @param pageType - Type of page (e.g., "category", "search", "checkout")
	 * @param customData - Optional additional data to include
	 */
	default: (pageType: string, action: string = "view", customData: Record<string, any> = {}): DataLayerEvent => {
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
	},

	error: () => {},
};

export default pageModule;
