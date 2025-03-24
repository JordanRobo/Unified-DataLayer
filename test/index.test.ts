import { expect, test, beforeEach, mock } from "bun:test";
import { DataLayerManager, DLManager, initializeDataLayer, pushDataLayerEvent, cleanValue } from "../src";

// Mock the window object
declare global {
	var window: {
		adobeDataLayer: any[];
		location: {
			host: string;
			pathname: string;
			href: string;
		};
	};
}

globalThis.window = {
	adobeDataLayer: [],
	location: {
		host: "example.com",
		pathname: "/home",
		href: "https://example.com/home",
	},
};

beforeEach(() => {
	// Reset the data layer for each test
	window.adobeDataLayer = [];
	// Re-initialize for each test
	initializeDataLayer();
});

test("DataLayerManager pushes events correctly", () => {
	const manager = new DataLayerManager(window.adobeDataLayer);
	manager.pushEvent("test_event", { test: "data" });

	expect(window.adobeDataLayer.length).toBe(1);
	expect(window.adobeDataLayer[0].event).toBe("test_event");
	expect(window.adobeDataLayer[0].test).toBe("data");
});

test("pushDataLayerEvent adds site info on first event", () => {
	const result = pushDataLayerEvent("first_event", { custom: "value" });

	expect(window.adobeDataLayer.length).toBe(1);
	expect(window.adobeDataLayer[0].default.site).toBeDefined();
	expect(window.adobeDataLayer[0].default.site.name).toBe("dlt");
	expect(window.adobeDataLayer[0].custom).toBe("value");
});

test("DLManager.homeView pushes correct event", () => {
	DLManager.homeView();

	expect(window.adobeDataLayer.length).toBe(1);
	expect(window.adobeDataLayer[0].event).toBe("page_default");
	expect(window.adobeDataLayer[0].default.page.type).toBe("home");
	expect(window.adobeDataLayer[0].default.page.action).toBe("view");
});

test("DLManager.productView pushes correct product data", () => {
	const product = {
		"available_size": [
			"US WOMENS-6",
			"US WOMENS-6.5",
			"US WOMENS-7",
			"US WOMENS-7.5",
			"US WOMENS-8",
			"US WOMENS-8.5",
			"US WOMENS-9",
			"US WOMENS-9.5",
			"US WOMENS-10",
			"US WOMENS-10.5",
			"US WOMENS-11",
			"US WOMENS-12",
			"US WOMENS-13"
		],
		"brand": "asics",
		"category": "asics,womens,run,asics,gel-kayano,asics",
		"color": "black black",
		"feature": [
			"QA - TEST"
		],
		"gender": "womens",
		"name": "asics gel-kayano 31 (d wide) womens",
		"model": "gel-kayano",
		"parent_category": "footwear",
		"rating": 4.1,
		"reward_points": 320,
		"specialty": "daily runs",
		"sku_available": true,
		"sport": "running",
		"full_price": 319.99,
		"listed_price": 319.99,
		"is_markdown": false,
		"discount": 0,
		"parent_sku": "1012B671",
		"child_sku": "1012B671-001.BLK"
	};

	DLManager.pdpView(product);

	expect(window.adobeDataLayer.length).toBe(1);
	expect(window.adobeDataLayer[0].event).toBe("product_view");
	expect(window.adobeDataLayer[0].product.id).toBe("123");
	expect(window.adobeDataLayer[0].product.name).toBe("Test Product");
});

test("cleanValue formats strings correctly", () => {
	expect(cleanValue("Test String")).toBe("test-string");
	expect(cleanValue("Test|String")).toBe("test-string");
	expect(cleanValue("  Test  String  ")).toBe("test-string");
	expect(cleanValue("")).toBe("");
});
