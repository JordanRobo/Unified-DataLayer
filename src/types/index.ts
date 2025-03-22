export interface Site {
	name: string;
	experience: string;
	currency: string;
	division: string;
	domain: string;
	env: string;
	version: string;
}

export interface Page {
	type: string;
	action: string;
	path: string;
	title: string;
	url: string;
	list_name?: string;
}

export interface User {
	user_state: string;
	login_status: string;
	uem_hashed: string;
	session_id: string;
	divison_id: string;
}

export interface Default {
	site?: Site;
	page?: Page;
	user?: User;
	error?: any;
}

export interface DataLayerConfig {
	siteInfo?: Site;
}

export interface DataLayerEvent {
	event: string;
	default?: Default;
	[key: string]: any;
}

// Declare window types for TypeScript
declare global {
	interface Window {
		adobeDataLayer: any[];
	}
}
