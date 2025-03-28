import { BaseModule } from "../Base";

export interface CartMod {
	add(): void;
	remove(): void;
	update(): void;
	miniView(): void;
	fullView(): void;
}

export class CartImpl extends BaseModule implements CartMod {
	add(): void {}

	remove(): void {}

	update(): void {}

	miniView(): void {}

	fullView(): void {}
}
