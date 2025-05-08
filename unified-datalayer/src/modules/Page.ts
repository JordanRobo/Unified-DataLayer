import { BaseModule } from "../Base";

/**
 * Page module interface for tracking page-related events
 */
export interface PageMod {
	home(): void;
	view(pageType: string, action?: string): void;
	error(): void;
}

/**
 * Implementation of the Page Module interface
 */
export class PageImpl extends BaseModule implements PageMod {
	/**
	 * Track a home page view
	 */
	public home(): void {
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

	/**
	 * Track a page view for any page type
	 * @param pageType Type of page (e.g., "category", "search", "checkout")
	 * @param action The action performed on the page (default: "view")
	 */
	public view(pageType: string, action: string = "view"): void {
		try {
			this.validateString(pageType, "pageType");

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

	/**
	 * Track a page error
	 */
	public error(): void {
		// Implementation for error tracking
	}
}
