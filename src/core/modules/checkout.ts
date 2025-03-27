import type { DataLayerEvent } from "../../types";

export default function checkoutModule(datalayer: any) {
	return {
		/**
		 * Track a checkout step
		 * @param step - Checkout step number
		 * @param option - Optional checkout option (e.g., "Visa", "Home Delivery")
		 * @param customData - Optional additional data to include
		 */
		step1: (step: number, option?: string): DataLayerEvent => {
			return datalayer.pushEvent("checkout", {
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
	}
};