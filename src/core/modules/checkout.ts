import { pushDataLayerEvent } from "../..";
import type { DataLayerEvent, Product, ProductFilter } from "../../types";
import { cleanValue, formatProduct } from "../utils/cleanValue"

const checkoutModule = {
	/**
	 * Track a checkout step
	 * @param step - Checkout step number
	 * @param option - Optional checkout option (e.g., "Visa", "Home Delivery")
	 * @param customData - Optional additional data to include
	 */
	step1: (step: number, option?: string): DataLayerEvent => {
		return pushDataLayerEvent("checkout", {
			ecommerce: {
				checkout: {
					actionField: {
						step,
						option,
					},
				},
			},
		});
	},
};

export default checkoutModule;
