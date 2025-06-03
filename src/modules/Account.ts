import { BaseModule } from "../Base";

export interface AccountMod {
	/**
	 * Push an 'account_create-start' event to the datalayer
	 * 
	 * Used when a user initiates the account creation process. This event should be
	 * triggered when the user first accesses or opens the account registration form.
	 * 
	 * @example
	 * // Track when a user starts the account creation process
	 * const dl = getDataLayer();
	 * 
	 * dl.account.createStart();
	 * 
	 * @example
	 * // Typically called when the registration form first renders or becomes visible
	 * useEffect(() => {
	 *   if (isRegistrationFormVisible) {
	 *     dl.account.createStart();
	 *   }
	 * }, [isRegistrationFormVisible]);
	 */
	createStart(): void;

	/**
	* Push an 'account_create-complete' event to the datalayer
	* 
	* Used when a user successfully completes the account creation process. This event
	* should be triggered after the registration form has been submitted and the account
	* has been successfully created.
	* 
	* @example
	* // Track when a user successfully creates an account
	* const dl = getDataLayer();
	* 
	* dl.account.createComplete();
	* 
	* @example
	* // Typically called after successful form submission
	* const handleRegistrationSuccess = () => {
	*   dl.account.createComplete();
	*   // Redirect to welcome page or dashboard
	*   router.push('/welcome');
	* };
	* 
	* @example
	* // In an async registration handler
	* const submitRegistration = async (formData) => {
	*   try {
	*     await registerUser(formData);
	*     dl.account.createComplete();
	*   } catch (error) {
	*     // Handle registration error
	*   }
	* };
	*/
	createComplete(): void;

	/**
	* Push an 'account_login-start' event to the datalayer
	* 
	* Used when a user initiates the login process. This event should be triggered
	* when the user first accesses or opens the login form, indicating the start
	* of the authentication flow.
	* 
	* @example
	* // Track when a user starts the login process
	* const dl = getDataLayer();
	* 
	* dl.account.loginStart();
	* 
	* @example
	* // Typically called when the login form first renders or becomes visible
	* useEffect(() => {
	*   if (isLoginFormVisible) {
	*     dl.account.loginStart();
	*   }
	* }, [isLoginFormVisible]);
	* 
	* @example
	* // Track when user navigates to login page
	* const LoginPage = () => {
	*   useEffect(() => {
	*     dl.account.loginStart();
	*   }, []);
	*   
	*   return <LoginForm />;
	* };
	*/
	loginStart(): void;

	/**
	* Push an 'account_login-success' event to the datalayer
	* 
	* Used when a user successfully completes the login process. This event should be
	* triggered after the login form has been submitted and the user has been
	* successfully authenticated.
	* 
	* @example
	* // Track when a user successfully logs in
	* const dl = getDataLayer();
	* 
	* dl.account.loginSuccess();
	* 
	* @example
	* // Typically called after successful authentication
	* const handleLoginSuccess = () => {
	*   dl.account.loginSuccess();
	*   // Redirect to dashboard or previous page
	*   router.push('/dashboard');
	* };
	* 
	* @example
	* // In an async login handler
	* const submitLogin = async (credentials) => {
	*   try {
	*     await authenticateUser(credentials);
	*     dl.account.loginSuccess();
	*   } catch (error) {
	*     // Handle login error
	*   }
	* };
	*/
	loginSuccess(): void;
}

export class AccountImpl extends BaseModule implements AccountMod {

	createStart(): void {
		try {
			this.pushEvent("account_create-start", {
				default: {
					page: {
						type: "account",
						action: "create-start",
					},
				},
				form_info: {
					name: "create-account",
					type: "registration"
				}
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	createComplete(): void {
		try {
			this.pushEvent("account_create-complete", {
				default: {
					page: {
						type: "account",
						action: "create-complete",
					},
				},
				form_info: {
					name: "create-account",
					type: "registration",
					nl_subscription: true,
					loyalty_subscription: true
				},
			});
		} catch (error: any) {
			console.error(`[unified-datalayer] ${error.cause}: ${error.message}`);
		}
	}

	loginStart(): void {
		try {
			this.pushEvent("account_login-start", {
				default: {
					page: {
						type: "account",
						action: "login-start",
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

	loginSuccess(): void {
		try {
			this.pushEvent("account_login-success", {
				default: {
					page: {
						type: "account",
						action: "login-complete",
					},
					user: {
						user_state: window.localStorage.getItem("uem_hashed") ? "customer" : "guest",
						login_state: window.localStorage.getItem("uem_hashed") ? "logged-in" : "anonymous",
						uem_hashed: window.localStorage.getItem("uem_hashed") ?? "",
						session_id: "",
						division_id: "",
					}
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
