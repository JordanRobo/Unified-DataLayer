import { BaseModule } from "../Base";

export interface OrderModule {
	success(): void;
}

export class OrderImpl extends BaseModule implements OrderModule {
	success(): void {
		try {
			this.pushEvent("order_success", {
				default: {
					page: {
						type: "order",
						action: "success",
					}
				},
				order: {
					orderId: "2000013527",
					currency: "AUD",
					checkout_type: "regular", 
					newsletter_signup: true, 
					geo: {
						state: "nsw",
						city: "wolli-creek",
						zipcode: "2205"
					},
					payments: [
						{
							type: "creditcard", 
							method: "braintree-vi",
							amount: 359.90,
							status: "processing"
						},
						{
							type: "loyalty-points",
							method: "loyalty",
							points_total: 300,
							amount: 30
						}
					],
					delivery: {
						type: "delivery",
						method: "delivery"
					},
					shipping: {
						base: 9,
						gst: 1
					},
					total: 189.99,
					revenue: 170.14,
					tax: 19.85
				},
				cart: {
					cartId: "3f176aac-f6a6-4b0e-8f4c-555143560c7a",
					cart_quantity: "1",
					cart_total: "189.99"
				},
				cart_items: [{
					brand: "asics",
					gender: "women",
					parent_category: "footwear",
					category: "womens-run",
					model: "gel-kayano",
					story: "gel-kayano-25",
					color: "blue",
					sport: "run",
					speciality: "run",
					parent_sku: "1012A026",
					child_sku: "1012A026-101",
					name: "asics-gel-kayano-25-womens-skylight-illusion-blue",
					qty: 1,
					sale_price: 170.14,
					sale_GST: 19.85,
        			is_markdown: false
				}]
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}
}
