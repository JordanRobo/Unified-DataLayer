import { BaseModule } from "../Base";
import { CartProductData } from "../types";

export interface CartMod {
	add(product: CartProductData): void;
	remove(childSku: string): void;
	update(childSku: string, quantity: number): void;
	miniView(items: CartProductData[], cartInput: CartInput): void;
	fullView(items: CartProductData[], cartInput: CartInput): void;

	getCartItems(): CartProductData[];
	getCartInfo(): Cart;
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
	// Internal state
	private cartItems: CartProductData[] = [];
	private cartInfo: Cart = {
		cartId: '',
		quoteId: '',
		cart_quantity: '0',
		cart_total: '0.00'
	};

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
		this.validateCartProductData(product);

		const cartItem = this.formatCartItem(product);
		const existingItemIndex = this.cartItems.findIndex(item => item.child_sku === product.child_sku);

		if (existingItemIndex !== -1) {
			this.cartItems[existingItemIndex].qty = (this.cartItems[existingItemIndex].qty || 0) + (product.qty || 1);
		} else {
			this.cartItems.push(product);
		}

		const cartCalculations = this.calculateCart(this.cartItems);
		this.cartInfo = {
			...this.cartInfo,
			...cartCalculations
		};

		this.pushEvent("cart_add", {
			default: {
				page: {
					type: "cart",
					action: "add",
					name: "add-to-cart"
				}
			},
			cart_items: [cartItem]
		});
	}

	remove(childSku: string): void {
		this.validateString(childSku, 'childSku');

		const itemIndex = this.cartItems.findIndex(item => item.child_sku === childSku);

		if (itemIndex === -1) {
			console.warn(`Item with SKU ${childSku} not found in cart`);
			return;
		}

		const removedItem = { ...this.cartItems[itemIndex] };

		this.cartItems.splice(itemIndex, 1);

		const cartCalculations = this.calculateCart(this.cartItems);
		this.cartInfo = {
			...this.cartInfo,
			...cartCalculations
		};

		const cart_item_removed = this.formatCartItem(removedItem);
		const cart_items = [
			...this.cartItems.map(product => this.formatCartItem(product)),
			null
		];

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
			cart: this.cartInfo
		});
	}

	update(childSku: string, quantity: number): void {
		this.validateMultiple([
			{
				value: childSku,
				paramName: 'childSku',
				type: "string"
			},
			{
				value: quantity,
				paramName: 'quantity',
				type: "number"
			}
		]);

		const itemIndex = this.cartItems.findIndex(item => item.child_sku === childSku);

		if (itemIndex === -1) {
			console.warn(`Item with SKU ${childSku} not found in cart`);
			return;
		}

		this.cartItems[itemIndex].qty = quantity;

		const cartCalculations = this.calculateCart(this.cartItems);
		this.cartInfo = {
			...this.cartInfo,
			...cartCalculations
		};

		const cart_items = this.cartItems.map(product => this.formatCartItem(product));

		this.pushEvent("cart_update", {
			default: {
				page: {
					type: "cart",
					action: "update",
					name: "update-cart-item-qty"
				}
			},
			cart_items,
			cart: this.cartInfo
		});
	}

	miniView(items: CartProductData[], cartInput: CartInput): void {
		this.syncCartState(items, cartInput);

		const cart_items = this.cartItems.map(product => this.formatCartItem(product));

		this.pushEvent("cart_view-mini", {
			default: {
				page: {
					type: "cart",
					action: "view-mini",
					name: "view-mini-cart"
				}
			},
			cart_items,
			cart: this.cartInfo
		});
	}

	fullView(items: CartProductData[], cartInput: CartInput): void {
		this.syncCartState(items, cartInput);

		const cart_items = this.cartItems.map(product => this.formatCartItem(product));

		this.pushEvent("cart_view-full", {
			default: {
				page: {
					type: "cart",
					action: "view-full",
				}
			},
			cart_items,
			cart: this.cartInfo
		});
	}

	// Helper method to sync the cart state
	private syncCartState(items: CartProductData[], cartInput: CartInput): void {
		this.cartItems = [...items];

		this.cartInfo = {
			cartId: cartInput.cartId || '',
			quoteId: cartInput.quoteId || '',
			...this.calculateCart(items)
		};
	}

	getCartItems(): CartProductData[] {
		return [...this.cartItems];
	}

	getCartInfo(): Cart {
		return { ...this.cartInfo };
	}
}