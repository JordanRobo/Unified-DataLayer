import { pushDataLayerEvent, cleanValue, formatProduct } from "../..";
import type { DataLayerEvent, Product, ProductFilter } from "../..";

const checkoutModule = {
	/**
	 * Track a checkout step
	 * @param step - Checkout step number
	 * @param option - Optional checkout option (e.g., "Visa", "Home Delivery")
	 * @param customData - Optional additional data to include
	 */
	step1: (step: number, option?: string, customData: Record<string, any> = {}): DataLayerEvent => {
		return pushDataLayerEvent("checkout", {
			ecommerce: {
				checkout: {
					actionField: {
						step,
						option,
					},
				},
			},
			...customData,
		});
	},
};

export default checkoutModule;
