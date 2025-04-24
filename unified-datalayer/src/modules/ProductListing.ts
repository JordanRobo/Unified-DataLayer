import { BaseModule } from "../Base";
import { ProductData, BaseProduct } from "../types";

export interface ProductListingMod {
	view(productsArray: ProductData[], listName?: string): void;
	filter(list_filters: ListFilters): void;
	sort(option: string): void;
	click(): void;
}

/**
 * Options to include with the 'product_listing-filters' event
 * 
 * This interface defines the structure for product listing filters
 * that are tracked when users apply filtering options to product lists.
 */
interface ListFilters {
	/**
	 * The types of filters being applied
	 * 
	 * Multiple filter types should be separated with a pipe character '|'
	 * Example: "category|price|color|size"
	 */
	filter_type: string;

	/**
	 * The values for each corresponding filter type
	 * 
	 * Values should be in the same order as filter_type entries
	 * Multiple filter types are separated with a pipe character '|'
	 * Multiple values for a single filter type are separated with a comma ','
	 * 
	 * Example: "sneakers|50-100|red,blue|M,L"
	 * This would represent:
	 * - category: sneakers
	 * - price: 50-100
	 * - color: red,blue (two values for color)
	 * - size: M,L (two values for size)
	 */
	filter_value: string;
}

interface PLP_Product extends BaseProduct {
	position: number;
}

export class ProductListingImpl extends BaseModule implements ProductListingMod {
	/**
	 * Push a 'product_listing-view' event to the datalayer
	 * 
	 * Used when a user navigates to any page containing a list of products/items.
	 * This event should be triggered once when the product listing page initially loads.
	 * 
	 * @param {ProductData[]} productsArray - An array of products displayed on the page
	 * @param {string} [listName] - The name of the product list (optional)
	 *                              If not provided, the URL slug will be automatically used
	 * 
	 * @returns {void}
	 * 
	 * @example
	 * // Basic usage with just products
	 * const dl = getDataLayer();
	 * 
	 * const products = [
	 *   {
	 *     item_id: "SKU123",
	 *     item_name: "Premium T-Shirt",
	 *     price: 29.99,
	 *     // other product properties...
	 *   },
	 *   // additional products...
	 * ];
	 * 
	 * dl.plp.view(products);
	 * 
	 * @example
	 * // With custom list name
	 * dl.plp.view(products, "Summer Collection");
	 */
	view(productsArray: ProductData[], listName?: string): void {
		const list_name = listName || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");

		const products: PLP_Product[] = productsArray.map((product, i) => ({
			position: i,
			...this.formatProduct(product),
		}));

		this.clearProducts();
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

	/**
	 * Push a 'product_listing-filters' event to the datalayer
	 * 
	 * Used whenever a user applies filters to a product listing, such as price ranges, 
	 * categories, colors, sizes, etc. This should be triggered each time filters are 
	 * modified by the user.
	 * 
	 * @param {ListFilters} list_filters - Object containing filter types and values
	 * 
	 * @returns {void}
	 * 
	 * @example
	 * // Single filter type with a single value
	 * const dl = getDataLayer();
	 * 
	 * dl.plp.filters({
	 *   filter_type: "category",
	 *   filter_value: "sneakers"
	 * });
	 * 
	 * @example
	 * // Multiple filter types with single values
	 * dl.plp.filters({
	 *   filter_type: "category|price",
	 *   filter_value: "sneakers|50-100"
	 * });
	 * 
	 * @example
	 * // Multiple filter types with multiple values for some types
	 * dl.plp.filters({
	 *   filter_type: "category|price|color",
	 *   filter_value: "womens,sneakers,sale|50-100|red,blue"
	 * });
	 */
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

	/**
	 * Push a 'product_listing-sort' event to the datalayer
	 * 
	 * Used when a user changes the sort order of products in a listing page.
	 * This event should be triggered whenever the user selects a different 
	 * sorting option from a dropdown or other sorting control.
	 * 
	 * @param {string} option - The sort option selected by the user
	 *                          Examples include "price_descending", "price_ascending",
	 *                          "newest", "bestselling", "relevance", etc.
	 * 
	 * @returns {void}
	 * 
	 * @example
	 * // Track when a user sorts products by price (high to low)
	 * const dl = getDataLayer();
	 * 
	 * dl.plp.sort("price_descending");
	 * 
	 * @example
	 * // Track when a user sorts products by newest first
	 * dl.plp.sort("newest");
	 */
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
