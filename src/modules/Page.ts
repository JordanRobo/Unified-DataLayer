import { BaseModule } from "../Base";

/**
 * Page module interface for tracking page-related events
 */
export interface PageMod {
	/**
	 * Track a home page view
	 */
	home(): void;

	/**
	 * Track a page view for any page type
	 * @param pageType Type of page (e.g., "category", "search", "checkout")
	 * @param action The action performed on the page (default: "view")
	 */
	view(pageType: string, action?: string): void;

	/**
	 * Track a page error
	 */
	error(): void;
}

/**
 * Implementation of the Page Module interface
 */
export class PageImpl extends BaseModule implements PageMod {
	home(): void {
		this.pushEvent("page_default", {
			default: {
				page: {
					type: "home",
					action: "view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? this.formatString(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
				},
			},
		});
	}

	view(pageType: string, action: string = "view"): void {
		try {
			this.validateString(pageType, "pageType");
			this.validateString(action, "action");

			this.pushEvent("page_default", {
				default: {
					page: {
						type: pageType,
						action: action,
						path: typeof window !== "undefined" ? window.location.pathname : "",
						title: typeof document !== "undefined" ? this.formatString(document.title) : "",
						url: typeof window !== "undefined" ? window.location.href : "",
					},
				},
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	error(): void {
		// Implementation for error tracking
	}
}
