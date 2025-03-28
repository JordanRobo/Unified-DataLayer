import { BaseModule } from "../Base";

export interface CheckoutMod {
	start(): void;
	step2(): void;
	step3(): void;
}

export class CheckoutImpl extends BaseModule implements CheckoutMod {
	start(): void {}

	step2(): void {}

	step3(): void {}
}
