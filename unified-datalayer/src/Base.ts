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
	protected pushEvent(eventName: string, eventData: EventData = {}): Promise<void> {
		return this.dataLayer.pushEvent(eventName, eventData);
	}

	protected clearProducts(): void {
		this.dataLayer.clearProducts();
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
		cleaned = cleaned.replace(/\|/g, " ");
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
			discount: Number((((product.full_price - product.listed_price) / product.full_price) * 100).toFixed(2)),
			feature: product.feature || [],
			full_price: product.full_price,
			gender: this.formatString(product.gender),
			is_markdown: product.full_price !== product.listed_price,
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
			discount: Number((((product.full_price - product.listed_price) / product.full_price) * 100).toFixed(2)),
			feature: product.feature || [],
			full_price: product.full_price,
			gender: this.formatString(product.gender),
			is_markdown: product.full_price !== product.listed_price,
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

	/**
	* Validates that a string parameter meets requirements
	*/
	protected validateString(value: any, paramName: string, options: {
		required?: boolean;
		allowEmpty?: boolean;
		minLength?: number;
		maxLength?: number;
		pattern?: RegExp;
	} = {}): void {
		const {
			required = true,
			allowEmpty = false,
			minLength,
			maxLength,
			pattern
		} = options;

		if (required && (value === undefined || value === null)) {
			throw new Error(`${paramName} is required.`);
		}

		if (typeof value !== 'string') {
			throw new Error(`${paramName} must be a string.`);
		}

		if (!allowEmpty && value.trim().length === 0) {
			throw new Error(`${paramName} cannot be empty or whitespace.`);
		}

		if (minLength !== undefined && value.length < minLength) {
			throw new Error(`${paramName} must be at least ${minLength} characters long.`);
		}

		if (maxLength !== undefined && value.length > maxLength) {
			throw new Error(`${paramName} cannot exceed ${maxLength} characters.`);
		}

		if (pattern && !pattern.test(value)) {
			throw new Error(`${paramName} format is invalid.`);
		}
	}

	/**
	 * Validates that a number parameter meets requirements
	 */
	protected validateNumber(value: any, paramName: string, options: {
		required?: boolean;
		integer?: boolean;
		min?: number;
		max?: number;
		positive?: boolean;
	} = {}): void {
		const {
			required = true,
			integer = false,
			min,
			max,
			positive = false
		} = options;

		if (required && (value === undefined || value === null)) {
			throw new Error(`${paramName} is required.`);
		}

		if (typeof value !== 'number') {
			throw new Error(`${paramName} must be a number.`);
		}

		if (isNaN(value)) {
			throw new Error(`${paramName} must be a valid number.`);
		}

		if (integer && !Number.isInteger(value)) {
			throw new Error(`${paramName} must be an integer.`);
		}

		if (positive && value < 0) {
			throw new Error(`${paramName} must be positive.`);
		}

		if (min !== undefined && value < min) {
			throw new Error(`${paramName} must be at least ${min}.`);
		}

		if (max !== undefined && value > max) {
			throw new Error(`${paramName} cannot exceed ${max}.`);
		}
	}

	/**
	 * Validates multiple arguments at once
	 */
	protected validateMultiple(validations: Array<{
		value: any;
		paramName: string;
		type: 'string' | 'number';
		options?: any;
	}>): void {
		for (const validation of validations) {
			if (validation.type === 'string') {
				this.validateString(validation.value, validation.paramName, validation.options);
			} else if (validation.type === 'number') {
				this.validateNumber(validation.value, validation.paramName, validation.options);
			}
		}
	}

	/**
	 * Validates that input is of type ProductData
	 * @param data 
	 * @param paramName 
	 */
	protected validateProductData(data: any, paramName: string = 'productData'): asserts data is ProductData {
		if (!data || typeof data !== 'object') {
			throw new Error(`${paramName} must be an object.`);
		}

		const validationErrors: string[] = [];

		const validateField = (validationFn: () => void) => {
			try {
				validationFn();
			} catch (error) {
				// @ts-ignore
				validationErrors.push(`${error.message}`);
			}
		};

		validateField(() => this.validateString(data.brand, 'brand'));
		validateField(() => this.validateString(data.child_sku, 'child_sku'));
		validateField(() => this.validateString(data.color, 'color'));
		validateField(() => this.validateString(data.gender, 'gender'));
		validateField(() => this.validateString(data.name, 'name'));
		validateField(() => this.validateString(data.parent_category, 'parent_category'));
		validateField(() => this.validateString(data.parent_sku, 'parent_sku'));

		validateField(() => this.validateNumber(data.full_price, 'full_price', { positive: true }));
		validateField(() => this.validateNumber(data.listed_price, 'listed_price', { positive: true }));

		if (!Array.isArray(data.category)) {
			validationErrors.push('category: must be an array');
		} else {
			data.category.forEach((cat: any, index: number) => {
				validateField(() => this.validateString(cat, `category[${index}]`));
			});
		}

		if (data.sku_available !== undefined && typeof data.sku_available !== 'boolean') {
			validationErrors.push('sku_available: must be a boolean');
		}

		if (validationErrors.length > 0) {
			const errorMessage = `${paramName} validation failed:\n  + ${validationErrors.join('\n  + ')}`;
			throw new Error(errorMessage);
		}
	}

	protected validateCartProductData(data: any, paramName: string = 'cartProductData'): asserts data is CartProductData {
		if (!data || typeof data !== 'object') {
			throw new Error(`${paramName} must be an object.`);
		}

		const validationErrors: string[] = [];

		const validateField = (validationFn: () => void) => {
			try {
				validationFn();
			} catch (error) {
				// @ts-ignore
				validationErrors.push(`${error.message}`);
			}
		};

		validateField(() => this.validateString(data.brand, 'brand'));
		validateField(() => this.validateString(data.child_sku, 'child_sku'));
		validateField(() => this.validateString(data.color, 'color'));
		validateField(() => this.validateString(data.gender, 'gender'));
		validateField(() => this.validateString(data.name, 'name'));
		validateField(() => this.validateString(data.parent_category, 'parent_category'));
		validateField(() => this.validateString(data.parent_sku, 'parent_sku'));
		validateField(() => this.validateString(data.sku_by_size, 'sku_by_size'));
		validateField(() => this.validateString(data.size, 'size'));

		validateField(() => this.validateNumber(data.full_price, 'full_price', { positive: true }));
		validateField(() => this.validateNumber(data.listed_price, 'listed_price', { positive: true }));
		validateField(() => this.validateNumber(data.qty, 'qty', { positive: true }));

		if (!Array.isArray(data.category)) {
			validationErrors.push('category: must be an array');
		} else {
			data.category.forEach((cat: any, index: number) => {
				validateField(() => this.validateString(cat, `category[${index}]`));
			});
		}

		if (data.sku_available !== undefined && typeof data.sku_available !== 'boolean') {
			validationErrors.push('sku_available: must be a boolean');
		}

		if (validationErrors.length > 0) {
			const errorMessage = `${paramName} validation failed:\n  + ${validationErrors.join('\n  + ')}`;
			throw new Error(errorMessage);
		}
	}

}
