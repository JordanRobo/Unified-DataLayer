import { BaseModule } from "../Base";

export interface CheckoutMod {
	start(): void;
	step2(): void;
	step3(): void;
}

export class CheckoutImpl extends BaseModule implements CheckoutMod {
	start(): void {
		try {
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
