import { writable } from "svelte/store";
import type { DataLayerEvent } from "../types";

// Create a store to track data layer events
export const dataLayerEvents = writable<DataLayerEvent[]>([]);

// Create a store for current page data
export const currentPage = writable<{
	type: string;
	action: string;
	path: string;
	url: string;
	title: string;
}>({
	type: "",
	action: "",
	path: "",
	url: "",
	title: "",
});

// Create a store for current product data (if on a product page)
export const currentProduct = writable<{
	id: string | number;
	name: string;
	price?: number;
	category?: string;
	[key: string]: any;
} | null>(null);
