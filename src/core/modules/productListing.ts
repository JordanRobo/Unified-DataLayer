import { pushDataLayerEvent } from "../..";
import type { DataLayerEvent, Product, ProductFilter } from "../../types";
import { cleanValue, formatProduct } from "../utils/cleanValue"

const productListingModule = {
	/**
	 * Creates a data layer event for product listing views with formatted product data
	 *
	 * This method takes an array of products, formats each one using the formatProduct function,
	 * adds positional information, and returns a structured data layer event. It's designed to
	 * work in both browser and server environments.
	 *
	 * @param {Product[]} productsArray - Array of product objects to be formatted and tracked
	 * @param {string} [listName] - Optional name of the product list. Defaults to the last segment of the URL path
	 *
	 * @returns {DataLayerEvent} A formatted data layer event object for product listing views
	 *
	 * @example
	 * // Basic usage with just products
	 * const products = [
	 *   {
	 *     brand: "Nike",
	 *     category: "Footwear",
	 *     child_sku: "ABC123",
	 *     color: "Black|White",
	 *     discount: 20,
	 *     feature: ["Lightweight", "Cushioned"],
	 *     full_price: 120,
	 *     gender: "Men",
	 *     is_markdown: true,
	 *     listed_price: "100",
	 *     model: "Air Max",
	 *     name: "Air Max 270",
	 *     parent_category: "Shoes",
	 *     parent_sku: "XYZ789",
	 *     rating: 4.5
	 *   }
	 * ];
	 *
	 * const event = DataLayer.plp.view(products);
	 *
	 * // With custom list name and additional data
	 * const customEvent = DataLayer.plp.view(
	 *   products,
	 *   "featured-products",
	 *   { source: "homepage", campaign: "summer-sale" }
	 * );
	 */
	view: (productsArray: Product[], listName?: string): DataLayerEvent => {
		const list_name = listName || (typeof window !== "undefined" ? window.location.pathname.split("/").filter(Boolean).pop() : "");

		const products = productsArray.map((product, i) => ({
			position: i,
			...formatProduct(product),
		}));

		return pushDataLayerEvent("product_listing-view", {
			default: {
				page: {
					type: "product",
					action: "listing-view",
					path: typeof window !== "undefined" ? window.location.pathname : "",
					title: typeof document !== "undefined" ? cleanValue(document.title) : "",
					url: typeof window !== "undefined" ? window.location.href : "",
					list_name,
				},
			},
			products,
		});
	},

	filter: (filterData: ProductFilter): DataLayerEvent => {
		return pushDataLayerEvent("product_listing-filters", {
			default: {
				page: {
					type: "product",
					action: "listing-view",
				},
			},
			list_filters: filterData,
		});
	},

	sort: (option: string): DataLayerEvent => {
		return pushDataLayerEvent("product_listing-sort", {
			default: {
				page: {
					type: "product",
					action: "listing-sort",
				},
			},
			list_sort: {
				option,
			},
		});
	},
};

export default productListingModule;
