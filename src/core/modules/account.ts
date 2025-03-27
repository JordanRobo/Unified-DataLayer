import type { DataLayerEvent } from "../../types";

export default function accountModule(datalayer: any){
	return{
		/**
		 * Track a user login event
		 * @param method - Login method (e.g., "email", "facebook")
		 */
		loginStart: (method: string): DataLayerEvent => {
			return datalayer.pushEvent("user_login", {
				user: {
					login_method: method,
				},
			});
		},

		loginSuccess: () => {},

		createStart: () => {},

		createSuccess: () => {},
	}
};