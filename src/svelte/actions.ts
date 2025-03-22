import { DLManager } from "../core/DataLayerFacade";

/**
 * Svelte action to track clicks
 *
 * @example
 * <button use:trackClick={() => DLManager.addToCart(product)}>
 *   Add to Cart
 * </button>
 */
export function trackClick(node: HTMLElement, callback: () => void) {
	const handleClick = () => {
		callback();
	};

	node.addEventListener("click", handleClick);

	return {
		update(newCallback: () => void) {
			node.removeEventListener("click", handleClick);
			callback = newCallback;
			node.addEventListener("click", handleClick);
		},
		destroy() {
			node.removeEventListener("click", handleClick);
		},
	};
}

/**
 * Svelte action to track form submissions
 *
 * @example
 * <form use:trackFormSubmit={{ name: 'contact-form' }}>
 *   <!-- Form fields -->
 * </form>
 */
export function trackFormSubmit(
	node: HTMLFormElement,
	params: {
		name: string;
		data?: Record<string, any>;
		customData?: Record<string, any>;
	},
) {
	const handleSubmit = (event: Event) => {
		DLManager.formSubmit(params.name, params.data, params.customData);
	};

	node.addEventListener("submit", handleSubmit);

	return {
		update(newParams: { name: string; data?: Record<string, any>; customData?: Record<string, any> }) {
			params = newParams;
		},
		destroy() {
			node.removeEventListener("submit", handleSubmit);
		},
	};
}

/**
 * Svelte action to track page view when a component mounts
 *
 * @example
 * <div use:trackPageView={{ type: 'home' }}>
 *   <!-- Page content -->
 * </div>
 */
export function trackPageView(
	node: HTMLElement,
	params: {
		type: string;
		action?: string;
		customData?: Record<string, any>;
	},
) {
	// Track the page view when the component mounts
	DLManager.pageView(params.type, params.action || "view", params.customData);

	return {
		update(newParams: { type: string; action?: string; customData?: Record<string, any> }) {
			if (newParams.type !== params.type || newParams.action !== params.action) {
				DLManager.pageView(newParams.type, newParams.action || "view", newParams.customData);
			}
			params = newParams;
		},
	};
}
