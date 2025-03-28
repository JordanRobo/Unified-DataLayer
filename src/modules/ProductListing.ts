import { BaseModule } from "../Base";
import { ProductData } from "../types";

export interface ProductListingMod {
	view(productsArray: ProductData[], listName?: string): void;
	filter(): void;
	sort(): void;
	click(): void;
}

export class ProductListingImpl extends BaseModule implements ProductListingMod {
	view(productsArray: ProductData[], listName?: string): void {
		const list_name = listName || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");

		const products = productsArray.map((product, i) => ({
			position: i,
			...this.formatProduct(product),
		}));

		this.pushEvent("product_listing-view", {
			default: {
				page: {
					type: "product",
					action: "listing-view",
					list_name,
				},
			},
		});
	}

	filter(): void {}

	sort(): void {}

	click(): void {}
}
