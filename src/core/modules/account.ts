import { pushDataLayerEvent } from "../..";
import type { DataLayerEvent } from "../..";

const accountModule = {
	/**
	 * Track a user login event
	 * @param method - Login method (e.g., "email", "facebook")
	 * @param customData - Optional additional data to include
	 */
	loginStart: (method: string, customData: Record<string, any> = {}): DataLayerEvent => {
		return pushDataLayerEvent("user_login", {
			user: {
				login_method: method,
				...customData,
			},
		});
	},

	loginSuccess: () => {},

	createStart: () => {},

	createSuccess: () => {},
};

export default accountModule;
