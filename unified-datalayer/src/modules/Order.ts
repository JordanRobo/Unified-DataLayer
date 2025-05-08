import { BaseModule } from "../Base";

export interface OrderModule {
	success(): void;
}

export class OrderImpl extends BaseModule implements OrderModule {
	success(): void {
		try {
			this.pushEvent("order_success", {});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}
}
