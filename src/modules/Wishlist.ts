import { BaseModule } from "../Base";
import { ProductData, BaseProduct } from "../types";

export interface WishlistMod {
	view(productsArray: ProductData[]): void;
	add(productData: ProductData): void;
}

export class WishlistImpl extends BaseModule implements WishlistMod {
	view(productsArray: ProductData[]): void {
		try {
			if (!productsArray) {
				throw new Error("productsArray is required.", { cause: "REQUIRED_FIELD_MISSING" });
			}

			productsArray.forEach((product) => {
				this.validateProductData(product);
			});

			const products: BaseProduct[] = productsArray.map((product) => ({ ...this.formatProduct(product) }));

			this.clearProducts();
			this.pushEvent("wishlist_home", {
				default: {
					page: {
						type: "wishlist",
						action: "home",
					},
				},
				products,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	add(productData: ProductData): void {
		try {
			this.validateProductData(productData);

			const products = [this.formatProduct(productData)];

			this.clearProducts();
			this.pushEvent("add_to-wishlist", {
				default: {
					page: {
						type: "wishlist",
						action: "add",
					},
				},
				products,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}
}
