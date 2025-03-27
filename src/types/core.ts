import type { ProductParams } from "./product";

export interface Site {
	name: string;
	experience: string;
	currency: string;
	division: string;
	domain: string;
	env: string;
	version: string;
}

export interface Page {
	type: string;
	action: string;
	path: string;
	title: string;
	url: string;
	list_name?: string;
}

export interface Cart {
	cartId: string;
	quoteId: string;
	cart_quantity: number;
	cart_total: number;
}

export interface CartItem {
	product: ProductParams;
	quantity: number;
}
