import { BaseModule } from "../Base";
import { ProductData } from "../types";

/**
 * ProductDisplay module interface for tracking product detail page events
 */
export interface ProductDisplayMod {
	view(productData: ProductData): void;
	colorSelect(color: string): void;
	sizeSelect(size: string): void;
}

export class ProductDisplayImpl extends BaseModule implements ProductDisplayMod {
	view(productData: ProductData): void {
		const product = this.formatProduct(productData);

		this.pushEvent("product_view", {
			default: {
				page: {
					type: "product",
					action: "view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? this.formatString(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
				},
			},
			product,
		});
	}

	colorSelect(color: string): void {
		this.pushEvent("product_color-select", {
			default: {
				page: {
					type: "product",
					action: "color-select",
				},
			},
			product: { color },
		});
	}

	sizeSelect(size: string): void {
		this.pushEvent("product_size_select", {
			default: {
				page: {
					type: "product",
					action: "size-select"
				}
			},
			product: { size }
		})
	}
}
