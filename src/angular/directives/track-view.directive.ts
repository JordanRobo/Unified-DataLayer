import { Directive, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { DLManagerService } from "../dl-manager.service";

@Directive({
	selector: "[trackView]",
})
export class TrackViewDirective implements OnInit, OnChanges {
	@Input() trackView!: string; // Page type
	@Input() trackAction: string = "view"; // Page action
	@Input() trackData: Record<string, any> = {}; // Custom data

	constructor(private dlManager: DLManagerService) {}

	ngOnInit() {
		this.trackPageView();
	}

	ngOnChanges(changes: SimpleChanges) {
		// Re-track if the page type or action changes
		if ((changes["trackView"] && !changes["trackView"].firstChange) || (changes["trackAction"] && !changes["trackAction"].firstChange)) {
			this.trackPageView();
		}
	}

	private trackPageView() {
		if (this.trackView) {
			this.dlManager.pageView(this.trackView, this.trackAction, this.trackData);
		}
	}
}

@Directive({
	selector: "[trackProduct]",
})
export class TrackProductDirective implements OnInit, OnChanges {
	@Input() trackProduct!: {
		id: string | number;
		name: string;
		price?: number;
		category?: string;
		[key: string]: any;
	}; // Product data
	@Input() trackProductData: Record<string, any> = {}; // Custom data

	constructor(private dlManager: DLManagerService) {}

	ngOnInit() {
		this.trackProductView();
	}

	ngOnChanges(changes: SimpleChanges) {
		// Re-track if the product changes
		if (changes["trackProduct"] && !changes["trackProduct"].firstChange) {
			this.trackProductView();
		}
	}

	private trackProductView() {
		if (this.trackProduct) {
			this.dlManager.productView(this.trackProduct, this.trackProductData);
		}
	}
}

@Directive({
	selector: "[trackEvent]",
})
export class TrackEventDirective {
	@Input() trackEvent!: string; // Event name
	@Input() trackEventData: Record<string, any> = {}; // Event data

	constructor(private dlManager: DLManagerService) {}

	ngOnInit() {
		if (this.trackEvent) {
			this.dlManager.trackEvent(this.trackEvent, this.trackEventData);
		}
	}
}
