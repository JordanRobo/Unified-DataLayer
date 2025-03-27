import type { DataLayerEvent, EventParams } from "../types";

/**
 * DataLayerManager - A utility for managing Adobe Data Layer events
 * without requiring flush events.
 */
class DataLayerManager {
	private dataLayer: any[];
	private previousEvent: any | null;
	private propertiesToNullify: Record<string, string[]>;

	/**
	 * Creates a new DataLayerManager instance
	 * @param dataLayer - Reference to the Adobe Data Layer array
	 */
	constructor(dataLayer: any[]) {
		this.dataLayer = dataLayer;
		this.previousEvent = null;

		this.propertiesToNullify = {
			default: ["error"], 
		};
	}

	/**
	 * Pushes an event to the data layer with smart nullification
	 * @param eventName - The name of the event
	 * @param data - The data to include in this event
	 * @returns The complete event object that was pushed
	 */
	dataLayerPush(eventName: string, data: EventParams = {}): DataLayerEvent {
		const eventObj: DataLayerEvent = {
			event: eventName,
			...data,
		};

		if (this.previousEvent) {
			Object.keys(this.previousEvent).forEach((key) => {
				if (key === "event") return;

				if (key === "default") {
					if (typeof this.previousEvent[key] === "object" && this.previousEvent[key] !== null && !Array.isArray(this.previousEvent[key])) {
						if (!(key in eventObj) || typeof eventObj[key] !== "object" || eventObj[key] === null) {
							eventObj[key] = {};
						}

						const propertiesToCheck = this.propertiesToNullify[key] || [];
						propertiesToCheck.forEach((nestedKey) => {
							if (
								typeof eventObj[key] === "object" &&
								eventObj[key] !== null &&
								nestedKey in this.previousEvent[key] &&
								typeof this.previousEvent[key] === "object" &&
								this.previousEvent[key] !== null &&
								!(nestedKey in (eventObj[key] as Record<string, any>))
							) {
								(eventObj[key] as Record<string, any>)[nestedKey] = null;
							}
						});
					}
				} else if (!(key in eventObj)) {
					eventObj[key] = null;
				}
			});
		}

		this.dataLayer.push(eventObj);

		this.previousEvent = JSON.parse(JSON.stringify(eventObj));

		return eventObj;
	}

	/**
	 * Configure properties that should be automatically nullified
	 * @param properties - Map of object keys to arrays of properties to nullify
	 */
	setPropertiesToNullify(properties: Record<string, string[]>): void {
		this.propertiesToNullify = properties;
	}

	/**
	 * Add properties to nullify for a specific object key
	 * @param key - The object key (e.g., 'default')
	 * @param properties - Array of property names to nullify
	 */
	addPropertiesToNullify(key: string, properties: string[]): void {
		this.propertiesToNullify[key] = [...(this.propertiesToNullify[key] || []), ...properties];
	}
}

export default DataLayerManager;
