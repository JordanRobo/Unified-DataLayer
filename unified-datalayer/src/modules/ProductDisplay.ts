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
	}

	/**
	 * 
	 * @param color 
	 */
	colorSelect(color: string): void {
		this.validateString(color, 'color');

		this.pushEvent("product_color-select", {
			default: {
				page: {
					type: "product",
					action: "color-select",
				},
			},
			products: [{ color }],
		});
	}

	/**
	 * This selects the size of the product
	 * @param size 
	 */
	sizeSelect(size: string): void {
		this.validateString(size, 'size');

		this.pushEvent("product_size_select", {
			default: {
				page: {
					type: "product",
					action: "size-select"
				}
			},
			products: [{ size }]
		});

	}
}
