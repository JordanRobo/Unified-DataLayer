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
	/**
	 *
	 * @param productData
	 */
	view(productData: ProductData): void {
		try {
			this.validateProductData(productData);

			const products = [this.formatProduct(productData)];

			this.clearProducts();
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
				products,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	/**
	 *
	 * @param color
	 */
	colorSelect(color: string): void {
		try {
			this.validateString(color, "color");

			this.pushEvent("product_color-select", {
				default: {
					page: {
						type: "product",
						action: "color-select",
					},
				},
				products: [{ color }],
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	/**
	 * This selects the size of the product
	 * @param size
	 */
	sizeSelect(size: any): void {
		try {
			this.validateString(size, "size");

			this.pushEvent("product_size-select", {
				default: {
					page: {
						type: "product",
						action: "size-select",
					},
				},
				products: [{ size }],
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}
}
