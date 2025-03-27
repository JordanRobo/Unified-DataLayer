import { pushDataLayerEvent, cleanValue, formatProduct } from "../..";
import type { DataLayerEvent, Product } from "../..";

const productDisplayModule = {
	/**
	 * Track a product detail page view
	 * @param {Product} productData - Product information
	 * @param customData - Optional additional data to include
	 */
	view: (productData: Product, customData: Record<string, any> = {}): DataLayerEvent => {
		const cleanProduct = formatProduct(productData);

		return pushDataLayerEvent("product_view", {
			default: {
				page: {
					type: "product",
					action: "view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					...customData,
				},
			},
			products: [ cleanProduct ],
		});
	},

	colorSelect: (color: string, customData: Record<string, any> = {}): DataLayerEvent => {
		return pushDataLayerEvent("product_color-select", {
			default: {
				page: {
					type: "product",
					action: "color-select",
					...customData,
				},
			},
			products: [{ color }],
		});
	},

	sizeSelect: (size: string, customData: Record<string, any> = {}): DataLayerEvent => {
		return pushDataLayerEvent("product_size-select", {
			default: {
				page: {
					type: "product",
					action: "size-select",
					...customData,
				},
			},
			products: [{ size }],
		});
	},
};

export default productDisplayModule;
