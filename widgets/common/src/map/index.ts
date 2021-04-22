import DefaultTileLayer from './DefaultTileLayer';
import { getMapOptions } from './options';
import { isSiteWithPosition, Site, siteToLatLng, SiteWithPosition } from './site';
import {
    getWidgetDimensions,
    invalidateSizeAfterDimensionsChange,
    useWidgetDimensions,
    WidgetDimensions
} from './widget-dimensions';

declare global {
    namespace Stage.Common.Map {
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
            DefaultTileLayer
        };
    }
}

Stage.defineCommon({
    name: 'Map',
    common: {
        invalidateSizeAfterDimensionsChange,
        getWidgetDimensions,
        useWidgetDimensions,
        getMapOptions,
        isSiteWithPosition,
        siteToLatLng,
        DefaultTileLayer
    }
});
