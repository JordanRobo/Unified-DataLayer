import { BaseModule } from "../Base";
import { ProductData, Cart_Product, CartProductData } from "../types";

export interface CartMod {
	add(product: ProductData): void;
	remove(removed: CartProductData, cart_items: CartProductData[], cartInput: CartInput): void;
	update(items: CartProductData[], cartInput: CartInput): void;
	miniView(items: CartProductData[], cartInput: CartInput): void;
	fullView(items: CartProductData[], cartInput: CartInput): void;
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


export class CartImpl extends BaseModule implements CartMod {

	private calculateCart(items: CartProductData[]): { cart_quantity: string, cart_total: string } {
		const totalQuantity = items.reduce((total, item) => total + (item.qty || 0), 0);
		const totalPrice = items.reduce((total, item) =>
			total + ((item.listed_price || 0) * (item.qty || 0)), 0);

		return {
			cart_quantity: totalQuantity.toString(),
			cart_total: totalPrice.toFixed(2)
		};
	}

	add(product: CartProductData): void {
		const cart_items: Cart_Product[] = [this.formatCartItem(product)];

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

	remove(removed: CartProductData, items: CartProductData[], cartInput: CartInput): void {
		const cart_item_removed: Cart_Product = this.formatCartItem(removed);

		const cart_items = [
			...items.map(({ ...product }) => ({
				...this.formatCartItem(product)
			})),
			null
		];

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

	update(items: CartProductData[], cartInput: CartInput): void {
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

	miniView(items: CartProductData[], cartInput: CartInput): void {
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

	fullView(items: CartProductData[], cartInput: CartInput): void {
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
