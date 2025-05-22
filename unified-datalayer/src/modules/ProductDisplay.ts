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
	 * Push a 'product_view' event to the datalayer
	 * 
	 * Used when a user views a single product detail page.
	 * This event should be triggered once when the product detail page initially loads.
	 * 
	 * @param {ProductData} productData - The product data object for the viewed product
	 * 
	 * @example
	 * // Track when a user views a product detail page
	 * const dl = getDataLayer();
	 * 
	 * const product = {
	 *   item_id: "SKU456",
	 *   item_name: "Premium Running Shoes",
	 *   price: 89.99,
	 *   // other product properties...
	 * };
	 * 
	 * dl.product.view(product);
	 * 
	 * @throws {Error} If product data validation fails, including missing required fields
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
	 * Push a 'product_color-select' event to the datalayer
	 * 
	 * Used when a user selects a color option on a product detail page.
	 * This event should be triggered each time the user changes the color selection.
	 * 
	 * @param {string} color - The selected color value
	 * 
	 * @example
	 * // Track when a user selects a color for a product
	 * const dl = getDataLayer();
	 * 
	 * // When user clicks on or selects the "Navy Blue" color option
	 * dl.product.colorSelect("Navy Blue");
	 * 
	 * @throws {Error} If color parameter validation fails (e.g., empty string)
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
	 * Push a 'product_size-select' event to the datalayer
	 * 
	 * Used when a user selects a size option on a product detail page.
	 * This event should be triggered each time the user changes the size selection.
	 * 
	 * @param {string} size - The selected size value
	 * 
	 * @example
	 * // Track when a user selects a size for a product
	 * const dl = getDataLayer();
	 * 
	 * // When user clicks on or selects the "Medium" size option
	 * dl.product.sizeSelect("Medium");
	 * 
	 * @throws {Error} If size parameter validation fails (e.g., empty string)
	 */
	sizeSelect(size: string): void {
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
