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

type CartInput = { cartId: string; quoteId?: string } | { cartId?: string; quoteId: string };

export class CartImpl extends BaseModule implements CartMod {
	// Internal state
	private cartItems: CartProductData[] = [];
	private cartInfo: Cart = {
		cartId: "",
		quoteId: "",
		cart_quantity: "0",
		cart_total: "0.00",
	};

	private calculateCart(items: CartProductData[]): { cart_quantity: string; cart_total: string } {
		const totalQuantity = items.reduce((total, item) => total + (item.qty || 0), 0);
		const totalPrice = items.reduce((total, item) => total + (item.listed_price || 0) * (item.qty || 0), 0);

		return {
			cart_quantity: totalQuantity.toString(),
			cart_total: totalPrice.toFixed(2),
		};
	}

	/**
	 * Push a 'cart_add' event to the datalayer
	 * 
	 * Used when a user adds a product to their shopping cart.
	 * 
	 * @param {CartProductData} product - The product data to add to the cart
	 * 
	 * @returns {void}
	 * 
	 * @throws {Error} Will throw an error if the product data validation fails
	 * 
	 * @example
	 * // Add a product to the cart
	 * const dl = getDataLayer();
	 * 
	 * dl.cart.add({
	 *   item_id: "SKU123",
	 *   item_name: "Premium T-Shirt",
	 *   price: 29.99,
	 *   qty: 1,
	 *   child_sku: "SKU123-M-BLU"
	 *   // other product properties...
	 * });
	 */
	add(product: CartProductData): void {
		try {
			this.validateCartProductData(product);

			const cartItem = this.formatCartItem(product);
			const existingItemIndex = this.cartItems.findIndex((item) => item.child_sku === product.child_sku);

			if (existingItemIndex !== -1) {
				this.cartItems[existingItemIndex].qty = (this.cartItems[existingItemIndex].qty || 0) + (product.qty || 1);
			} else {
				this.cartItems.push(product);
			}

			const cartCalculations = this.calculateCart(this.cartItems);
			this.cartInfo = {
				...this.cartInfo,
				...cartCalculations,
			};

			this.pushEvent("cart_add", {
				default: {
					page: {
						type: "cart",
						action: "add",
						name: "add-to-cart",
					},
				},
				cart_items: [cartItem],
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	/**
	 * Push a 'cart_remove' event to the datalayer
	 * 
	 * Used when a user removes an item from their cart entirely.
	 * This event uses the current cart state that should have been previously 
	 * initialised by a cart view event (miniView or fullView).
	 * 
	 * @param {string} childSku - The SKU identifier of the cart item to remove
	 * 
	 * @returns {void}
	 * 
	 * @throws {Error} Will throw an error if childSku is not a valid string
	 * 
	 * @example
	 * // Track when a user removes an item from their cart
	 * const dl = getDataLayer();
	 * 
	 * // First, ensure cart state is initialised with miniView or fullView
	 * // dl.cart.fullView(...);
	 * 
	 * // Then remove an item from the cart
	 * dl.cart.remove("SKU123-M-BLU");
	 * 
	 * @remarks
	 * This method depends on the cart state being initialised by calling either
	 * miniView() or fullView() before using this method. It will log a warning and
	 * do nothing if the specified item is not found in the current cart state.
	 * 
	 * The event tracks both the removed item specifically and the updated cart state
	 * after removal to provide comprehensive analytics data.
	 */
	remove(childSku: string): void {
		try {
			this.validateString(childSku, "childSku");

			const itemIndex = this.cartItems.findIndex((item) => item.child_sku === childSku);

			if (itemIndex === -1) {
				console.warn(`Item with SKU ${childSku} not found in cart`);
				return;
			}

			const removedItem = { ...this.cartItems[itemIndex] };

			this.cartItems.splice(itemIndex, 1);

			const cartCalculations = this.calculateCart(this.cartItems);
			this.cartInfo = {
				...this.cartInfo,
				...cartCalculations,
			};

			const cart_item_removed = this.formatCartItem(removedItem);
			const cart_items = [...this.cartItems.map((product) => this.formatCartItem(product)), null];

			this.pushEvent("cart_remove", {
				default: {
					page: {
						type: "cart",
						action: "remove",
						name: "remove-from-cart",
					},
				},
				cart_item_removed,
				cart_items,
				cart: this.cartInfo,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	/**
	 * Push a 'cart_update' event to the datalayer
	 * 
	 * Used when a user updates the quantity of an item in their cart.
	 * This event uses the current cart state that should have been previously 
	 * initialised by a cart view event (miniView or fullView).
	 * 
	 * @param {string} childSku - The SKU identifier of the cart item to update
	 * @param {number} quantity - The new quantity value for the cart item
	 * 
	 * @returns {void}
	 * 
	 * @throws {Error} Will throw an error if childSku is not a valid string
	 * @throws {Error} Will throw an error if quantity is not a valid number
	 * 
	 * @example
	 * // Track when a user updates the quantity of an item in their cart
	 * const dl = getDataLayer();
	 * 
	 * // First, ensure cart state is initialised with miniView or fullView
	 * // dl.cart.fullView(...);
	 * 
	 * // Then update an item's quantity
	 * dl.cart.update("SKU123-M-BLU", 3);
	 * 
	 * @remarks
	 * This method depends on the cart state being initialised by calling either
	 * miniView() or fullView() before using this method. It will log a warning and
	 * do nothing if the specified item is not found in the current cart state.
	 */
	update(childSku: string, quantity: number): void {
		try {
			this.validateMultiple([
				{
					value: childSku,
					paramName: "childSku",
					type: "string",
				},
				{
					value: quantity,
					paramName: "quantity",
					type: "number",
				},
			]);

			const itemIndex = this.cartItems.findIndex((item) => item.child_sku === childSku);

			if (itemIndex === -1) {
				console.warn(`Item with SKU ${childSku} not found in cart`);
				return;
			}

			this.cartItems[itemIndex].qty = quantity;

			const cartCalculations = this.calculateCart(this.cartItems);
			this.cartInfo = {
				...this.cartInfo,
				...cartCalculations,
			};

			const cart_items = this.cartItems.map((product) => this.formatCartItem(product));

			this.pushEvent("cart_update", {
				default: {
					page: {
						type: "cart",
						action: "update",
						name: "update-cart-item-qty",
					},
				},
				cart_items,
				cart: this.cartInfo,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	/**
	 * Push a 'cart_view-mini' event to the datalayer
	 * 
	 * Used when a user views their mini cart, typically shown as a dropdown or slide-out panel
	 * without navigating to the full cart page. This event synchronizes the cart state and 
	 * validates all cart items.
	 * 
	 * @param {CartProductData[]} items - Array of products currently in the cart
	 * @param {CartInput} cartInput - Object containing either cartId or quoteId to identify the cart
	 * 
	 * @returns {void}
	 * 
	 * @throws {Error} Will throw an error if items parameter is missing
	 * @throws {Error} Will throw an error if neither cartId nor quoteId is provided
	 * @throws {Error} Will throw an error if cartId or quoteId is not a valid string
	 * @throws {Error} Will throw an error if any product data validation fails
	 * 
	 * @example
	 * // Track when a user views their mini cart
	 * const dl = getDataLayer();
	 * 
	 * const cartItems = [
	 *   {
	 *     item_id: "SKU123",
	 *     item_name: "Premium T-Shirt",
	 *     price: 29.99,
	 *     qty: 2,
	 *     child_sku: "SKU123-M-BLU"
	 *     // other product properties...
	 *   },
	 *   // additional cart items...
	 * ];
	 * 
	 * dl.cart.miniView(cartItems, { cartId: "cart_12345" });
	 * 
	 * @example
	 * // Alternative using quoteId instead of cartId
	 * dl.cart.miniView(cartItems, { quoteId: "quote_67890" });
	 */
	miniView(items: CartProductData[], cartInput: CartInput): void {
		try {
			if (!items) {
				throw new Error("items is required.", { cause: "REQUIRED_FIELD_MISSING" });
			}

			if (cartInput?.cartId) {
				this.validateString(cartInput.cartId, "cartId");
			} else if (cartInput?.quoteId) {
				this.validateString(cartInput.quoteId, "quoteId");
			} else {
				throw new Error("either cartId or quoteId is required.", { cause: "REQUIRED_FIELD_MISSING" });
			}

			items.forEach((item) => {
				this.validateCartProductData(item);
			});

			this.syncCartState(items, cartInput);

			const cart_items = this.cartItems.map((product) => this.formatCartItem(product));

			this.pushEvent("cart_view-mini", {
				default: {
					page: {
						type: "cart",
						action: "view-mini",
						name: "view-mini-cart",
					},
				},
				cart_items,
				cart: this.cartInfo,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	/**
	 * Push a 'cart_view-full' event to the datalayer
	 * 
	 * Used when a user navigates to the full cart page to view their shopping cart.
	 * This event synchronizes the cart state and validates all cart items.
	 * 
	 * @param {CartProductData[]} items - Array of products currently in the cart
	 * @param {CartInput} cartInput - Object containing either cartId or quoteId to identify the cart
	 * 
	 * @returns {void}
	 * 
	 * @throws {Error} Will throw an error if items parameter is missing
	 * @throws {Error} Will throw an error if neither cartId nor quoteId is provided
	 * @throws {Error} Will throw an error if cartId or quoteId is not a valid string
	 * @throws {Error} Will throw an error if any product data validation fails
	 * 
	 * @example
	 * // Track when a user views the full cart page
	 * const dl = getDataLayer();
	 * 
	 * const cartItems = [
	 *   {
	 *     item_id: "SKU123",
	 *     item_name: "Premium T-Shirt",
	 *     price: 29.99,
	 *     qty: 2,
	 *     child_sku: "SKU123-M-BLU"
	 *     // other product properties...
	 *   },
	 *   // additional cart items...
	 * ];
	 * 
	 * dl.cart.fullView(cartItems, { cartId: "cart_12345" });
	 * 
	 * @example
	 * // Alternative using quoteId instead of cartId
	 * dl.cart.fullView(cartItems, { quoteId: "quote_67890" });
	 */
	fullView(items: CartProductData[], cartInput: CartInput): void {
		try {
			if (!items) {
				throw new Error("items is required.", { cause: "REQUIRED_FIELD_MISSING" });
			}

			if (cartInput.cartId) {
				this.validateString(cartInput.cartId, "cartId");
			} else if (cartInput.quoteId) {
				this.validateString(cartInput.quoteId, "quoteId");
			} else {
				throw new Error("either cartId or quoteId is required.", { cause: "REQUIRED_FIELD_MISSING" });
			}

			items.forEach((item) => {
				this.validateCartProductData(item);
			});

			this.syncCartState(items, cartInput);

			const cart_items = this.cartItems.map((product) => this.formatCartItem(product));

			this.pushEvent("cart_view-full", {
				default: {
					page: {
						type: "cart",
						action: "view-full",
						name: "view-full-cart",
					},
				},
				cart_items,
				cart: this.cartInfo,
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	// Helper method to sync the cart state
	private syncCartState(items: CartProductData[], cartInput: CartInput): void {
		this.cartItems = [...items];

		this.cartInfo = {
			cartId: cartInput.cartId || "",
			quoteId: cartInput.quoteId || "",
			...this.calculateCart(items),
		};
	}

	getCartItems(): CartProductData[] {
		return [...this.cartItems];
	}

	getCartInfo(): Cart {
		return { ...this.cartInfo };
	}
}
