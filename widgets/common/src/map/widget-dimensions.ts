import type { RefObject } from 'react';
import { useMemo } from 'react';
import type { Map } from 'react-leaflet';

export interface WidgetDimensions {
    width: number;
    height: number;
    maximized: boolean;
}

export function getWidgetDimensions(widget: Stage.Types.Widget<unknown>): WidgetDimensions {
    return {
        width: widget.width,
        height: widget.height,
        maximized: widget.maximized
    };
}

/** @returns Memoized widget dimensions. When changed, map size should be invalidated */
export function useWidgetDimensions(widget: Stage.Types.Widget<unknown>): WidgetDimensions {
    return useMemo(() => getWidgetDimensions(widget), [widget.width, widget.height, widget.maximized]);
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
