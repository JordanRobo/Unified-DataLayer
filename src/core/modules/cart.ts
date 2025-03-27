import { pushDataLayerEvent } from "../..";
import type { DataLayerEvent, Product, Cart, CartItem } from "../../types";
import { cleanValue, formatProduct } from "../utils/cleanValue"

const cartModule = {
	/**
	 * Track an add to cart event
	 * @param productData - Product information
	 * @param quantity - Quantity added to cart
	 */
	add: (productData: CartItem): DataLayerEvent => {
		let { product, quantity } = productData;

		return pushDataLayerEvent("cart_add", {
			default: {
				page: {
					type: "cart",
					action: "add",
					name: "add-to-cart",
				},
			},
			cart_items: [
				{
					...formatProduct(product),
					quantity,
				},
			],
		});
	},

	remove: (productData: Product, cartItems: CartItem[], cartData: Cart): DataLayerEvent => {
		const cart_items = cartItems.map((item, i) => ({
			quantity: item.quantity,
			...formatProduct(item.product),
		}));

		return pushDataLayerEvent("cart_remove", {
			default: {
				page: {
					type: "cart",
					action: "remove",
				},
			},
			cart_item_removed: {
				...formatProduct(productData),
			},
			cart: {
				...cartData,
			},
			cart_items,
		});
	},

	update: () => {},

	viewMini: (cartItems: CartItem[], cartData: Cart, customData: Record<string, any> = {}): DataLayerEvent => {
		const cart_items = cartItems.map((item, i) => ({
			quantity: item.quantity,
			...formatProduct(item.product),
		}));

		return pushDataLayerEvent("cart_view-mini", {
			default: {
				page: {
					type: "cart",
					action: "view-mini",
				},
			},
			cart: {
				...cartData,
			},
			cart_items,
		});
	},

	viewFull: (cartItems: CartItem[], cartData: Cart): DataLayerEvent => {
		const cart_items = cartItems.map((item, i) => ({
			quantity: item.quantity,
			...formatProduct(item.product),
		}));

		return pushDataLayerEvent("cart_view-full", {
			default: {
				page: {
					type: "cart",
					action: "view-full",
				},
			},
			cart: {
				...cartData,
			},
			cart_items,
		});
	},
};

export default cartModule;
