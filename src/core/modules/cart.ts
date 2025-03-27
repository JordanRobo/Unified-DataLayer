import type { DataLayerEvent, Cart, CartItem, ProductParams } from "../../types";
import { formatProduct } from "../utils/cleanValue"

export default function cartModule(datalayer: any)  {
	return {
		/**
		 * Track an add to cart event
		 * @param cartItem - Product information and quantity to add
		 */
		add: (cartItem: CartItem): DataLayerEvent => {
			let { product, quantity } = cartItem;

			return datalayer.pushEvent("cart_add", {
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

		remove: (productData: ProductParams, cartItems: CartItem[], cartData: Cart): DataLayerEvent => {
			const cart_items = cartItems.map((item, i) => ({
				quantity: item.quantity,
				...formatProduct(item.product),
			}));

			return datalayer.pushEvent("cart_remove", {
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

			return datalayer.pushEvent("cart_view-mini", {
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

			return datalayer.pushEvent("cart_view-full", {
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
	}
};
