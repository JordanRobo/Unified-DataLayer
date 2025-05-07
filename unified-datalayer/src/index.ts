import DataLayer, { getDataLayer } from "./DataLayer";
import type { DataLayerConfig } from "./types";

if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', function (event) {
        console.error('Unhandled promise rejection (DataLayer):', event.reason);
    });
}

export { DataLayer, getDataLayer };
export type { DataLayerConfig };
