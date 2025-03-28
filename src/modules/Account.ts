import { BaseModule } from "../Base";

export interface AccountMod {
	createStart(): void;
	createComplete(): void;
	loginStart(): void;
	loginSuccess(): void;
}

export class AccountImpl extends BaseModule implements AccountMod {
	createStart(): void {}

	createComplete(): void {}

	loginStart(): void {}

	loginSuccess(): void {}
}
