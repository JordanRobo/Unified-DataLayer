import { pushDataLayerEvent } from "../..";
import type { DataLayerEvent, Product } from "../../types";
import { cleanValue, formatProduct } from "../utils/cleanValue"

const productDisplayModule = {
	/**
	 * Track a product detail page view
	 * @param {Product} productData - Product information
	 */
	view: (productData: Product): DataLayerEvent => {
		const cleanProduct = formatProduct(productData);

		return pushDataLayerEvent("product_view", {
			default: {
				page: {
					type: "product",
					action: "view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
				},
			},
			products: [ cleanProduct ],
		});
	},

	colorSelect: (color: string): DataLayerEvent => {
		return pushDataLayerEvent("product_color-select", {
			default: {
				page: {
					type: "product",
					action: "color-select",
				},
			},
			products: [{ color }],
		});
	},

	sizeSelect: (size: string): DataLayerEvent => {
		return pushDataLayerEvent("product_size-select", {
			default: {
				page: {
					type: "product",
					action: "size-select",
				},
			},
			products: [{ size }],
		});
	},
};

export default productDisplayModule;
