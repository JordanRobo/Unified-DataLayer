// Export Angular-specific implementation
export { DLManagerService } from "./dl-manager.service";
export { DLManagerModule } from "./dl-module";
export { TrackViewDirective, TrackProductDirective, TrackEventDirective } from "./directives/track-view.directive";

// Re-export core functionality that might be needed
export { initializeDataLayer, pushDataLayerEvent, resetFirstEventFlag, getDataLayerManager, cleanValue, DLManager } from "../index";
