import { BaseModule } from "../Base";
import { ProductData } from "../types";

export interface CartMod {
	add(product: ProductData): void;
	remove(removed: ProductData, cart_items: CartItems[], cartInput: CartInput): void;
	update(items: CartItems[], cartInput: CartInput): void;
	miniView(items: CartItems[], cartInput: CartInput): void;
	fullView(items: CartItems[], cartInput: CartInput): void;
}

interface Cart {
	cartId: string;
	quoteId: string;
	cart_quantity: string;
	cart_total: string;
}

type CartInput =
	| { cartId: string; quoteId?: string; }
	| { cartId?: string; quoteId: string; };

interface CartItems extends ProductData {
	qty: number;
}

export class CartImpl extends BaseModule implements CartMod {

	private calculateCart(items: CartItems[]): { cart_quantity: string, cart_total: string } {
		const totalQuantity = items.reduce((total, item) => total + (item.qty || 0), 0);
		const totalPrice = items.reduce((total, item) =>
			total + ((item.listed_price || 0) * (item.qty || 0)), 0);

		return {
			cart_quantity: totalQuantity.toString(),
			cart_total: totalPrice.toFixed(2)
		};
	}

	/**
	 * push a 'cart-add' event to the xpDataLayer
	 * @param {ProductData} product - Data of the product that is being added to cart
	 */
	add(product: ProductData): void {
		const cart_items = [this.formatProduct(product)];

		this.pushEvent("cart_add", {
			default: {
				page: {
					type: "cart",
					action: "add",
					name: "add-to-cart"
				}
			},
			cart_items
		})
	}

	/**
	 * push a 'cart_remove' event to the xpDataLayer
	 * @param {ProductData} removed - Product object containing data of the item that was removed
	 * @param {CartItems[]} items - Array of Product objects that still remain in the cart
	 * @param {CartInput} cartInput - Either the 'quoteId' or 'cartId' for the Cart object
	 */
	remove(removed: ProductData, items: CartItems[], cartInput: CartInput): void {
		const cart_item_removed = [this.formatProduct(removed)];

		const cart_items = items.map(({ qty, ...productData }) => ({
			...this.formatProduct(productData),
			qty
		}));

		const cart: Cart = {
			cartId: cartInput.cartId || '',
			quoteId: cartInput.quoteId || '',
			...this.calculateCart(items)
		};

		this.pushEvent("cart_remove", {
			default: {
				page: {
					type: "cart",
					action: "remove",
					name: "remove-from-cart"
				}
			},
			cart_item_removed,
			cart_items,
			cart
		})

	}

	/**
	 * push a 'cart_update' event to the xpDataLayer
	 * @param items 
	 * @param cartInput 
	 */
	update(items: CartItems[], cartInput: CartInput): void {
		const cart_items = items.map(({ qty, ...productData }) => ({
			...this.formatProduct(productData),
			qty
		}));

		const cart: Cart = {
			cartId: cartInput.cartId || '',
			quoteId: cartInput.quoteId || '',
			...this.calculateCart(items)
		};

		this.pushEvent("cart_update", {
			default: {
				page: {
					type: "cart",
					action: "update",
					name: "update-cart-item-qty"
				}
			},
			cart_items,
			cart
		})
	}

	/**
	 * push a 'cart_view-mini' event to the xpDataLayer
	 * @param items 
	 * @param cartInput 
	 */
	miniView(items: CartItems[], cartInput: CartInput): void {
		const cart_items = items.map(({ qty, ...productData }) => ({
			...this.formatProduct(productData),
			qty
		}));

		const cart: Cart = {
			cartId: cartInput.cartId || '',
			quoteId: cartInput.quoteId || '',
			...this.calculateCart(items)
		};

		this.pushEvent("cart_view-mini", {
			default: {
				page: {
					type: "cart",
					action: "view-mini",
					name: "view-mini-cart"
				}
			},
			cart_items,
			cart
		})
	}

	/**
	 * push a 'cart_view-full' event to the xpDataLayer
	 * @param items 
	 * @param cartInput 
	 */
	fullView(items: CartItems[], cartInput: CartInput): void {
		const cart_items = items.map(({ qty, ...productData }) => ({
			...this.formatProduct(productData),
			qty
		}));

		const cart: Cart = {
			cartId: cartInput.cartId || '',
			quoteId: cartInput.quoteId || '',
			...this.calculateCart(items)
		};

		this.pushEvent("cart_view-full", {
			default: {
				page: {
					type: "cart",
					action: "view-full",
				}
			},
			cart_items,
			cart
		})
	}
}
