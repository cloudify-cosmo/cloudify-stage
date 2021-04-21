import type { RefObject } from 'react';
import type { Map } from 'react-leaflet';

export interface WidgetDimensions {
    width: number;
    height: number;
    maximized: boolean;
}

/**
 * Updates the map's UI so it fits the new size.
 *
 * @returns A cleanup function, to be used e.g. in `useEffect`
 */
export function invalidateSizeAfterDimensionsChange(mapRef: RefObject<Map | null>) {
    // Widget properties change doesn't affect immediately DOM changes,
    // so it's necessary to wait a bit till DOM is updated.

    const refreshAfterDimensionChangeTimeout = 500;
    const timeoutId = setTimeout(() => {
        mapRef.current?.leafletElement.invalidateSize();
    }, refreshAfterDimensionChangeTimeout);

    return () => clearTimeout(timeoutId);
}
