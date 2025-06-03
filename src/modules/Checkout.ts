import { BaseModule } from "../Base";
import { CartProductData } from "../types";

export interface CheckoutMod {
	start(items: CartProductData[], cartInput: CartInput, checkout_type: string): void;
	step2(): void;
	step3(): void;
}

type CartInput = { cartId: string; quoteId?: string } | { cartId?: string; quoteId: string };

export class CheckoutImpl extends BaseModule implements CheckoutMod {

	private calculateCart(items: CartProductData[]): { cart_quantity: string; cart_total: string } {
		const totalQuantity = items.reduce((total, item) => total + (item.qty || 0), 0);
		const totalPrice = items.reduce((total, item) => total + (item.listed_price || 0) * (item.qty || 0), 0);
	
		return {
			cart_quantity: totalQuantity.toString(),
			cart_total: totalPrice.toFixed(2),
		};
	}

	start(items: CartProductData[], cartInput: CartInput, checkout_type: string = "regular"): void {
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

			const cart_items = items.map((product) => this.formatCartItem(product));
			const cart = { ...this.calculateCart(items), ...cartInput };

			this.pushEvent("checkout_start", {
				default: {
					page: {
						type: 'checkout',
						action: 'start'
					},
					user: {
						user_state: window.localStorage.getItem("uem_hashed") ? "customer" : "guest",
						login_state: window.localStorage.getItem("uem_hashed") ? "logged-in" : "anonymous",
						uem_hashed: window.localStorage.getItem("uem_hashed") ?? "",
						session_id: "",
						division_id: "",
					}
				},
				checkout_type,
				cart,
				cart_items
			})
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	step2(): void {
		try {
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	step3(): void {
		try {
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}
}
