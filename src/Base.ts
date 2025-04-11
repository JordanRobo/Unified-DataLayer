import DataLayer from "./DataLayer";
import { Product, ProductData, EventData, Cart_Product, CartProductData } from "./types";

/**
 * BaseModule provides shared functionality for all data layer modules
 */
export abstract class BaseModule {
	protected dataLayer: DataLayer;

	constructor(dataLayer: DataLayer) {
		this.dataLayer = dataLayer;
	}

	/**
	 * Pushes an event to the data layer
	 * @param eventName The name of the event
	 * @param eventData The data to include with the event
	 */
	protected pushEvent(eventName: string, eventData: EventData = {}): void {
		return this.dataLayer.pushEvent(eventName, eventData);
	}

	/**
	 * Formats a string by converting to lowercase and replacing spaces and certain
	 * special characters with hyphens while preserving apostrophes
	 *
	 * @param input - The string to format
	 * @returns The formatted string
	 */
	protected formatString(input: string): string {
		if (!input) return "";

		let cleaned = input.toLowerCase();
		cleaned = cleaned.trim();
		cleaned = cleaned.replace(/\|/g, "-");
		cleaned = cleaned.replace(/\s+/g, "-");

		return cleaned;
	}

	/**
	 * Takes a Product object and correctly formats it according to ProductResp interface
	 *
	 * @param product - The ProductInput object
	 * @returns The correctly formatted Product object
	 */
	protected formatProduct(product: ProductData): Product {
		const formattedProduct: Product = {
			brand: this.formatString(product.brand),
			category: product.category ? product.category.map((cat) => this.formatString(cat)).join(",") : "",
			child_sku: product.child_sku,
			color: this.formatString(product.color),
			discount: product.discount,
			feature: product.feature || [],
			full_price: product.full_price,
			gender: this.formatString(product.gender),
			is_markdown: product.is_markdown,
			listed_price: product.listed_price,
			name: this.formatString(product.name),
			parent_category: this.formatString(product.parent_category),
			parent_sku: product.parent_sku,
			sku_available: product.sku_available || false,
		};

		if (product.available_size) formattedProduct.available_size = product.available_size;
		if (product.barcode) formattedProduct.barcode = product.barcode;
		if (product.rating) formattedProduct.rating = product.rating;
		if (product.reward_points) formattedProduct.reward_points = product.reward_points;
		if (product.model) formattedProduct.model = this.formatString(product.model);
		if (product.speciality) formattedProduct.speciality = this.formatString(product.speciality);
		if (product.sport) formattedProduct.sport = this.formatString(product.sport);
		if (product.story) formattedProduct.story = this.formatString(product.story);

		return formattedProduct;
	}

	protected formatCartItem(product: CartProductData): Cart_Product {
		const formattedItem: Cart_Product = {
			brand: this.formatString(product.brand),
			category: product.category ? product.category.map((cat) => this.formatString(cat)).join(",") : "",
			child_sku: product.child_sku,
			color: this.formatString(product.color),
			discount: product.discount,
			feature: product.feature || [],
			full_price: product.full_price,
			gender: this.formatString(product.gender),
			is_markdown: product.is_markdown,
			listed_price: product.listed_price,
			name: this.formatString(product.name),
			parent_category: this.formatString(product.parent_category),
			parent_sku: product.parent_sku,
			sku_available: product.sku_available || false,
			size: product.size,
			sku_by_size: product.sku_by_size,
			qty: product.qty,
		};

		if (product.available_size) formattedItem.available_size = product.available_size;
		if (product.barcode) formattedItem.barcode = product.barcode;
		if (product.rating) formattedItem.rating = product.rating;
		if (product.reward_points) formattedItem.reward_points = product.reward_points;
		if (product.model) formattedItem.model = this.formatString(product.model);
		if (product.speciality) formattedItem.speciality = this.formatString(product.speciality);
		if (product.sport) formattedItem.sport = this.formatString(product.sport);
		if (product.story) formattedItem.story = this.formatString(product.story);

		return formattedItem;
	}
}
