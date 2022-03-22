import MapsActions from './MapsActions';
import DefaultTileLayer from './DefaultTileLayer';
import { getMapOptions } from './options';
import { isSiteWithPosition, Site, siteToLatLng, SiteWithPosition } from './site';
import {
    getWidgetDimensions,
    invalidateSizeAfterDimensionsChange,
    useWidgetDimensions,
    WidgetDimensions
} from './widget-dimensions';
import { MarkerIconColor, createMarkerIcon } from './MarkerIcon';

declare global {
    namespace Stage.Common.Map {
        export const Actions: typeof MapsActions;
        export {
            WidgetDimensions,
            getWidgetDimensions,
            useWidgetDimensions,
            Site,
            invalidateSizeAfterDimensionsChange,
            getMapOptions,
            isSiteWithPosition,
            SiteWithPosition,
            siteToLatLng,
            DefaultTileLayer,
            MarkerIconColor,
            createMarkerIcon
        };
    }
}

Stage.defineCommon({
    name: 'Map',
    common: {
        Actions: MapsActions,
        invalidateSizeAfterDimensionsChange,
        getWidgetDimensions,
        useWidgetDimensions,
        getMapOptions,
        isSiteWithPosition,
        siteToLatLng,
        DefaultTileLayer,
        createMarkerIcon
    }
});
