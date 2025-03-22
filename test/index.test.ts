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
		id: "123",
		name: "Test Product",
		price: 99.99,
	};

	DLManager.productView(product);

	expect(window.adobeDataLayer.length).toBe(1);
	expect(window.adobeDataLayer[0].event).toBe("product_view");
	expect(window.adobeDataLayer[0].product.id).toBe("123");
	expect(window.adobeDataLayer[0].product.name).toBe("Test Product");
});

test("cleanValue formats strings correctly", () => {
	expect(cleanValue("Test String")).toBe("test-string");
	expect(cleanValue("Test|String")).toBe("test-string");
	expect(cleanValue("  Test  String  ")).toBe("test--string");
	expect(cleanValue("")).toBe("");
});
