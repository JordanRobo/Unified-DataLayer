import { pushDataLayerEvent } from "../..";
import type { DataLayerEvent } from "../../types";

const accountModule = {
	/**
	 * Track a user login event
	 * @param method - Login method (e.g., "email", "facebook")
	 */
	loginStart: (method: string): DataLayerEvent => {
		return pushDataLayerEvent("user_login", {
			user: {
				login_method: method,
			},
		});
	},

	loginSuccess: () => {},

	createStart: () => {},

	createSuccess: () => {},
};

export default accountModule;
