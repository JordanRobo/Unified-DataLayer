import { pushDataLayerEvent, cleanValue, formatProduct } from "../..";
import type { DataLayerEvent, Product, Cart, CartItem } from "../..";

const cartModule = {
	/**
	 * Track an add to cart event
	 * @param productData - Product information
	 * @param quantity - Quantity added to cart
	 * @param customData - Optional additional data to include
	 */
	add: (productData: CartItem, customData: Record<string, any> = {}): DataLayerEvent => {
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
			...customData,
		});
	},

	remove: (productData: Product, cartItems: CartItem[], cartData: Cart, customData: Record<string, any> = {}): DataLayerEvent => {
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
			...customData,
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
			...customData,
		});
	},

	viewFull: (cartItems: CartItem[], cartData: Cart, customData: Record<string, any> = {}): DataLayerEvent => {
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
			...customData,
		});
	},
};

export default cartModule;
