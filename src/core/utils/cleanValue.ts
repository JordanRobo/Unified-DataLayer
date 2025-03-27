import { Product, ProductParams } from "../../types";

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
 * Takes a Product object and correctly formats it according to ProductResp interface
 *
 * @param product - The input Product object
 * @returns The correctly formatted ProductResp object
 */
export function formatProduct(product: ProductParams): Product {
	
	const formattedProduct: Product = {
		available_size: product.available_size || [],
		barcode: product.barcode || "",
		brand: cleanValue(product.brand),
		category: product.category ? product.category.map(cat => cleanValue(cat)).join(',') : "",
		child_sku: product.child_sku,
		color: cleanValue(product.color),
		discount: product.discount,
		feature: product.feature,
		full_price: product.full_price,
		gender: cleanValue(product.gender),
		is_markdown: product.is_markdown,
		listed_price: product.listed_price,
		model: cleanValue(product.model),
		name: cleanValue(product.name),
		parent_category: cleanValue(product.parent_category),
		parent_sku: product.parent_sku,
		rating: product.rating,
		reward_points: product.reward_points || 0,
		size: product.size || "",
		sku_available: product.sku_available || false,
		sku_by_size: product.sku_by_size || "",
		speciality: product.speciality ? cleanValue(product.speciality) : "",
		sport: product.sport ? cleanValue(product.sport) : "",
		story: product.story ? cleanValue(product.story) : ""
	};

	return formattedProduct;
}