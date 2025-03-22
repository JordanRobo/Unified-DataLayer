import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { DLManager } from "../core/DataLayerFacade";
import { DataLayerEvent } from "../types";
import { pushDataLayerEvent } from "../index";

@Injectable({
	providedIn: "root",
})
export class DLManagerService {
	// Observable source for data layer events
	private eventsSubject = new BehaviorSubject<DataLayerEvent[]>([]);

	// Observable stream of data layer events
	public events$: Observable<DataLayerEvent[]> = this.eventsSubject.asObservable();

	// Observable for current page info
	private pageSubject = new BehaviorSubject<{
		type: string;
		action: string;
		path: string;
		url: string;
		title: string;
	}>({
		type: "",
		action: "",
		path: "",
		url: "",
		title: "",
	});

	public page$ = this.pageSubject.asObservable();

	// Observable for current product info
	private productSubject = new BehaviorSubject<{
		id: string | number;
		name: string;
		price?: number;
		category?: string;
		[key: string]: any;
	} | null>(null);

	public product$ = this.productSubject.asObservable();

	constructor() {}

	/**
	 * Track a home page view
	 * @param customData - Optional additional data to include
	 */
	homeView(customData: Record<string, any> = {}): void {
		// Call the core implementation
		const event = DLManager.homeView(customData);

		// Update Angular observables
		this.pageSubject.next({
			type: "home",
			action: "view",
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Add to events
		const events = this.eventsSubject.value;
		this.eventsSubject.next([...events, event]);
	}

	/**
	 * Track a product listing page view
	 * @param listName - Optional name of the product list
	 * @param customData - Optional additional data to include
	 */
	productListingView(listName?: string, customData: Record<string, any> = {}): void {
		// Call the core implementation
		const event = DLManager.productListingView(listName, customData);

		// Update Angular observables
		this.pageSubject.next({
			type: "product",
			action: "listing-view",
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Reset current product
		this.productSubject.next(null);

		// Add to events
		const events = this.eventsSubject.value;
		this.eventsSubject.next([...events, event]);
	}

	/**
	 * Track a product detail page view
	 * @param productData - Product information
	 * @param customData - Optional additional data to include
	 */
	productView(
		productData: {
			id: string | number;
			name: string;
			price?: number;
			category?: string;
			[key: string]: any;
		},
		customData: Record<string, any> = {},
	): void {
		// Call the core implementation
		const event = DLManager.productView(productData, customData);

		// Update Angular observables
		this.pageSubject.next({
			type: "product",
			action: "detail-view",
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Set current product
		this.productSubject.next(productData);

		// Add to events
		const events = this.eventsSubject.value;
		this.eventsSubject.next([...events, event]);
	}

	/**
	 * Track a generic page view
	 * @param pageType - Type of page
	 * @param action - Action (default: 'view')
	 * @param customData - Optional additional data
	 */
	pageView(pageType: string, action: string = "view", customData: Record<string, any> = {}): void {
		// Call the core implementation
		const event = DLManager.pageView(pageType, action, customData);

		// Update Angular observables
		this.pageSubject.next({
			type: pageType,
			action: action,
			path: typeof window !== "undefined" ? window.location.pathname : "",
			url: typeof window !== "undefined" ? window.location.href : "",
			title: typeof document !== "undefined" ? document.title : "",
		});

		// Add to events
		const events = this.eventsSubject.value;
		this.eventsSubject.next([...events, event]);
	}

	/**
	 * Track any custom event
	 * @param eventName - Name of the event
	 * @param eventData - Event data
	 */
	trackEvent(eventName: string, eventData: Record<string, any> = {}): void {
		// Push to data layer
		const event = pushDataLayerEvent(eventName, eventData);

		// Add to events
		const events = this.eventsSubject.value;
		this.eventsSubject.next([...events, event]);
	}

	// Provide direct access to other DLManager methods
	get manager() {
		return DLManager;
	}
}
