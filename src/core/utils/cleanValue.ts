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

	// Replace pipe characters with hyphens
	cleaned = cleaned.replace(/\|/g, "-");

	// Replace spaces with hyphens
	cleaned = cleaned.replace(/\s+/g, "-");

	return cleaned;
}
