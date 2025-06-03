import { getDataLayer } from "../unified-datalayer/dist";
import data from "./product_data.json";

const dataLayer = getDataLayer();

window.onload = function () {
	dataLayer.init({
		siteInfo: {
			name: "test-site",
			experience: "desktop",
			currency: "USD",
			division: "testCompany",
			domain: "www.test-site.com",
			env: "dev",
			version: "1.0.0",
		},
	});
	console.log("DataLayer initialised successfully");
};

/*
 *   'page_default' buttons
 */
document.getElementById("home-view").addEventListener("click", () => {
	dataLayer.page.home();
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("default-view-valid").addEventListener("click", () => {
	dataLayer.page.view("blog");
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("default-view-invalid").addEventListener("click", () => {
	dataLayer.page.view();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'product_listing-view' buttons
 */
document.getElementById("plp-view").addEventListener("click", () => {
	dataLayer.plp.view(data.valid);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("plp-view-invalid").addEventListener("click", () => {
	dataLayer.plp.view(data.invalid);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("plp-view-empty").addEventListener("click", () => {
	dataLayer.plp.view();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'product_listing-filters' buttons
 */
document.getElementById("plp-filter").addEventListener("click", () => {
	dataLayer.plp.filter({ filter_type: "Price", filter_value: "50-100" });
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("plp-filter-invalid").addEventListener("click", () => {
	dataLayer.plp.filter({ filter_type: "Price", filter_value: 50 - 100 });
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("plp-filter-empty").addEventListener("click", () => {
	dataLayer.plp.filter();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'product_listing-sort' buttons
 */
document.getElementById("plp-sort").addEventListener("click", () => {
	dataLayer.plp.sort("Price Descending");
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("plp-sort-invalid").addEventListener("click", () => {
	dataLayer.plp.sort(true);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("plp-sort-empty").addEventListener("click", () => {
	dataLayer.plp.sort();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'product_view' buttons
 */
document.getElementById("pdp-view").addEventListener("click", () => {
	dataLayer.pdp.view(data.valid[0]);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("pdp-view-invalid").addEventListener("click", () => {
	dataLayer.pdp.view(data.invalid[0]);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("pdp-view-empty").addEventListener("click", () => {
	dataLayer.pdp.view();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'product_size-select' buttons
 */
document.getElementById("pdp-size").addEventListener("click", () => {
	dataLayer.pdp.sizeSelect("10");
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("pdp-size-invalid").addEventListener("click", () => {
	dataLayer.pdp.sizeSelect(10);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("pdp-size-empty").addEventListener("click", () => {
	dataLayer.pdp.sizeSelect("");
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'product_color-select' buttons
 */
document.getElementById("pdp-color").addEventListener("click", () => {
	dataLayer.pdp.colorSelect(data.valid[0].color);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("pdp-color-invalid").addEventListener("click", () => {
	dataLayer.pdp.colorSelect({ blue });
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("pdp-color-empty").addEventListener("click", () => {
	dataLayer.pdp.colorSelect("");
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'cart_add' buttons
 */
const cartItem1 = { qty: 1, sku_by_size: "987yt1bk21", size: "10", ...data.valid[0] };
const cartItem2 = { qty: 2, sku_by_size: "ijbhjk128901", size: "9", ...data.valid[1] };
const cartId = crypto.randomUUID().toString();

document.getElementById("cart-add").addEventListener("click", () => {
	dataLayer.cart.add(cartItem1);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("cart-add-invalid").addEventListener("click", () => {
	dataLayer.cart.add(data.valid[0]);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("cart-add-empty").addEventListener("click", () => {
	dataLayer.cart.add();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   'cart_view-mini' buttons
 */
document.getElementById("cart-view-mini").addEventListener("click", () => {
	dataLayer.cart.miniView([cartItem1, cartItem2], { cartId });
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("cart-view-mini-invalid").addEventListener("click", () => {
	dataLayer.cart.miniView([cartItem1, cartItem2]);
	setTimeout(updateDataLayerDisplay(), 500);
});

document.getElementById("cart-view-mini-empty").addEventListener("click", () => {
	dataLayer.cart.miniView();
	setTimeout(updateDataLayerDisplay(), 500);
});

/*
 *   custom console logging
 */
const consoleOutput = document.getElementById("console-output");
const dataLayerOutput = document.getElementById("data-layer-output");
const refreshDataLayerButton = document.getElementById("refresh-data-layer");

// Console output handling
const originalConsole = {
	log: console.log,
	error: console.error,
	info: console.info,
};

function addToConsole(type, args) {
	const entry = document.createElement("div");
	entry.className = `console-entry ${type}`;
	entry.textContent = args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" ");
	consoleOutput.appendChild(entry);
	consoleOutput.scrollTop = consoleOutput.scrollHeight;

	// Also log to actual console
	originalConsole[type](...args);

	// Automatically update the data layer display when console logs occur
	updateDataLayerDisplay();
}

console.log = function (...args) {
	addToConsole("log", args);
};

console.error = function (...args) {
	addToConsole("error", args);
};

console.info = function (...args) {
	addToConsole("info", args);
};

// Data Layer display functionality - always expanded objects
function updateDataLayerDisplay() {
	// Clear previous content
	dataLayerOutput.innerHTML = "";

	try {
		// Function to create formatted display of objects
		function createFormattedObject(key, value, depth = 0) {
			const container = document.createElement("div");
			container.className = "data-item";
			container.style.paddingLeft = depth > 0 ? "15px" : "0";

			// Format according to type
			if (typeof value === "object" && value !== null) {
				const isArray = Array.isArray(value);
				const count = isArray ? value.length : Object.keys(value).length;

				// Create header with key and type info
				const header = document.createElement("div");
				header.className = "data-header";

				// Add key if provided
				if (key !== "") {
					const keySpan = document.createElement("span");
					keySpan.className = "data-key";
					keySpan.textContent = key + ": ";
					header.appendChild(keySpan);
				}

				// Add type preview
				const preview = document.createElement("span");
				preview.className = "data-preview";
				header.appendChild(preview);

				container.appendChild(header);

				// Create content for child items
				const content = document.createElement("div");
				content.className = "data-content";

				// Add content based on type
				if (isArray) {
					if (count === 0) {
						const emptyElem = document.createElement("div");
						emptyElem.className = "data-empty";
						emptyElem.textContent = "[]";
						content.appendChild(emptyElem);
					} else {
						value.forEach((item, index) => {
							content.appendChild(createFormattedObject(`[${index}]`, item, depth + 1));
						});
					}
				} else {
					if (count === 0) {
						const emptyElem = document.createElement("div");
						emptyElem.className = "data-empty";
						emptyElem.textContent = "{}";
						content.appendChild(emptyElem);
					} else {
						Object.entries(value).forEach(([propKey, propValue]) => {
							content.appendChild(createFormattedObject(propKey, propValue, depth + 1));
						});
					}
				}

				container.appendChild(content);
			} else {
				// Handle primitive values
				const valueItem = document.createElement("div");
				valueItem.className = "data-primitive";

				// Add key if provided
				if (key !== "") {
					const keySpan = document.createElement("span");
					keySpan.className = "data-key";
					keySpan.textContent = key + ": ";
					valueItem.appendChild(keySpan);
				}

				// Add formatted value
				const valueSpan = document.createElement("span");
				formatSimpleValue(valueSpan, value);
				valueItem.appendChild(valueSpan);

				container.appendChild(valueItem);
			}

			return container;
		}

		// Helper to format primitive values with appropriate styling
		function formatSimpleValue(element, value) {
			if (value === null) {
				element.className = "data-null";
				element.textContent = "null";
			} else if (value === undefined) {
				element.className = "data-undefined";
				element.textContent = "undefined";
			} else if (typeof value === "string") {
				element.className = "data-string";
				element.textContent = `"${value}"`;
			} else if (typeof value === "number") {
				element.className = "data-number";
				element.textContent = value;
			} else if (typeof value === "boolean") {
				element.className = "data-boolean";
				element.textContent = value;
			} else {
				element.textContent = String(value);
			}
		}

		// Access the Adobe data layer
		if (window.adobeDataLayer) {
			// Create a section for the state
			const stateSection = document.createElement("div");
			stateSection.className = "data-section";

			const stateTitle = document.createElement("div");
			stateTitle.className = "data-title";
			stateTitle.textContent = "Data Layer State:";
			stateSection.appendChild(stateTitle);

			const stateContent = createFormattedObject("", window.adobeDataLayer.getState());
			stateSection.appendChild(stateContent);
			dataLayerOutput.appendChild(stateSection);

			// Add divider
			const divider = document.createElement("div");
			divider.className = "data-divider";
			dataLayerOutput.appendChild(divider);

			// Get recent events
			const recentEvents = window.adobeDataLayer.slice(Math.max(0, window.adobeDataLayer.length - 5), window.adobeDataLayer.length);

			// Create a section for events
			const eventsSection = document.createElement("div");
			eventsSection.className = "data-section";

			const eventsTitle = document.createElement("div");
			eventsTitle.className = "data-title";
			eventsTitle.textContent = "Recent Events:";
			eventsSection.appendChild(eventsTitle);

			const eventsContent = createFormattedObject("", recentEvents);
			eventsSection.appendChild(eventsContent);
			dataLayerOutput.appendChild(eventsSection);

			// Add info about total events
			const infoSection = document.createElement("div");
			infoSection.className = "data-info";
			infoSection.textContent = `Total events in data layer: ${window.adobeDataLayer.length}`;
			dataLayerOutput.appendChild(infoSection);
		} else {
			const notInitialized = document.createElement("div");
			notInitialized.className = "console-entry error";
			notInitialized.textContent = "Data Layer not initialized yet";
			dataLayerOutput.appendChild(notInitialized);
		}
	} catch (err) {
		const entry = document.createElement("div");
		entry.className = "console-entry error";
		entry.textContent = `Error accessing data layer: ${err.message}`;
		dataLayerOutput.appendChild(entry);
	}
}

// Add event listener for refresh button
refreshDataLayerButton.addEventListener("click", updateDataLayerDisplay);
