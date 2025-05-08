import { BaseModule } from "../Base";

export interface AccountMod {
	createStart(): void;
	createComplete(): void;
	loginStart(): void;
	loginSuccess(): void;
}

export class AccountImpl extends BaseModule implements AccountMod {
	createStart(): void {
		try {
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	createComplete(): void {
		try {
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	loginStart(): void {
		try {
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	loginSuccess(): void {
		try {
			this.pushEvent("account_login-success", {
				default: {
					page: {
						type: "account",
						action: "login-complete",
					},
				},
				form_info: {
					name: "account-login",
					type: "login",
				},
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}
}
