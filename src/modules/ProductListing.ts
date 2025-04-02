import { BaseModule } from "../Base";
import { ProductData } from "../types";

export interface ProductListingMod {
	view(productsArray: ProductData[], listName?: string): void;
	filter(list_filters: ListFilters): void;
	sort(option: string): void;
	click(): void;
}

interface ListFilters {
	filter_type: string;
	filter_value: string;
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
			products,
		});
	}

	filter(list_filters: ListFilters): void {
		this.pushEvent("product_listing-filters", {
			default: {
				page: {
					type: "product",
					action: "listing-filters"
				}
			},
			list_filters
		})
	}

	sort(option: string): void {
		this.pushEvent("product_listing-sort", {
			default: {
				page: {
					type: "product",
					action: "listing-sort"
				}
			},
			list_sort: {
				option
			}
		})
	}

	click(): void {}
}
