// Export Svelte-specific implementation
export { SvelteDLManager, DLManager } from "./SvelteDLManager";

// Export Svelte stores
export { dataLayerEvents, currentPage, currentProduct } from "./stores";

// Export Svelte actions
export { trackClick, trackFormSubmit, trackPageView } from "./actions";

// Re-export core functionality that might be needed
export { initializeDataLayer, pushDataLayerEvent, resetFirstEventFlag, getDataLayerManager, cleanValue } from "../index";
