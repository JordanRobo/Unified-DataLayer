import { Product } from "../../types";

/**
 * Cleans a string by converting to lowercase and replacing spaces and certain
 * special characters with hyphens while preserving apostrophes
 *
 * @param value - The string to clean
 * @returns The cleaned string
 */
export function cleanValue(value: string): string {
	if (!value) return "";

	// Convert to lowercase
	let cleaned = value.toLowerCase();

	// Trim whitespace before and after the string
	cleaned = cleaned.trim();

	// Replace pipe characters with hyphens
	cleaned = cleaned.replace(/\|/g, "-");

	// Replace spaces with hyphens
	cleaned = cleaned.replace(/\s+/g, "-");

	return cleaned;
}

/**
 * Takes a Product object and correctly formats it
 * 
 * @param product 
 * @returns the correctly formatted Product object
 */

export function formatProduct(product: Product): Product {
	const formattedProduct = { ...product };

	formattedProduct.brand = cleanValue(product.brand);
	formattedProduct.category = cleanValue(product.category);
	formattedProduct.color = cleanValue(product.color);
	formattedProduct.gender = cleanValue(product.gender);
	formattedProduct.model = cleanValue(product.model);
	formattedProduct.name = cleanValue(product.name);
	formattedProduct.parent_category = cleanValue(product.parent_category);

	if (product.speciality !== undefined) {
		formattedProduct.speciality = cleanValue(product.speciality);
	}

	if (product.sport !== undefined) {
		formattedProduct.sport = cleanValue(product.sport);
	}

	if (product.story !== undefined) {
		formattedProduct.story = cleanValue(product.story);
	}

	return formattedProduct;
}