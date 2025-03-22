// Export the React-specific implementation
export { ReactDLManager, useHomeView, usePLPView, usePDPView, usePageView, useEventTracker, DLManager } from "./ReactDLManager";

// Re-export core functionality that might be needed
export { initializeDataLayer, pushDataLayerEvent, resetFirstEventFlag, getDataLayerManager, cleanValue } from "../index";
