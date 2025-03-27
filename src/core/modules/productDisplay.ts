import type { DataLayerEvent, ProductParams} from "../../types";
import { cleanValue, formatProduct } from "../utils/cleanValue"

export default function productDisplayModule(dataLayer: any) {
	return {
	
		/**
		 * Track a product detail page view
		 * @param {Product} productData - Product information
		 */
		view: (productData: ProductParams): DataLayerEvent => {
			const formattedProduct = formatProduct(productData);

			return dataLayer.pushEvent("product_view", {
				default: {
					page: {
						type: "product",
						action: "view",
						path: typeof window !== "undefined" ? window.location.pathname : "",
						title: typeof document !== "undefined" ? cleanValue(document.title) : "",
						url: typeof window !== "undefined" ? window.location.href : "",
					},
				},
				products: [ formattedProduct ],
			});
		},

		colorSelect: (color: string): DataLayerEvent => {
			return dataLayer.pushEvent("product_color-select", {
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
			return dataLayer.pushEvent("product_size-select", {
				default: {
					page: {
						type: "product",
						action: "size-select",
					},
				},
				products: [{ size }],
			});
		},
	}
};