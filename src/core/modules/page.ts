import type { DataLayerEvent } from "../../types";
import { cleanValue } from "../utils/cleanValue"

export default function pageModule(datalayer: any) {
	return {
		/**
		 * Track a home page view
		 */
		home: (): DataLayerEvent => {
			return datalayer.pushEvent("page_default", {
				default: {
					page: {
						type: "home",
						action: "view",
						path: typeof window !== "undefined" ? window.location.pathname : "",
						title: typeof document !== "undefined" ? cleanValue(document.title) : "",
						url: typeof window !== "undefined" ? window.location.href : "",
					},
				},
			});
		},

		/**
		 * Track a page view for any page type
		 * @param pageType - Type of page (e.g., "category", "search", "checkout")
		 */
		default: (pageType: string, action: string = "view"): DataLayerEvent => {
			return datalayer.pushEvent("page_default", {
				default: {
					page: {
						type: pageType,
						action: action,
						path: typeof window !== "undefined" ? window.location.pathname : "",
						title: typeof document !== "undefined" ? cleanValue(document.title) : "",
						url: typeof window !== "undefined" ? window.location.href : "",
					},
				},
			});
		},

		error: () => {},
	}
};