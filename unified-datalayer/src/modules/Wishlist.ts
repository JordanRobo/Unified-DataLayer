import { BaseModule } from "../Base";

export interface WishlistMod {
	view(): void;
	add(): void;
}

export class WishlistImpl extends BaseModule implements WishlistMod {
	view(): void {}

	add(): void {}
}
