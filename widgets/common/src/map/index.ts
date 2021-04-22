import DefaultTileLayer from './DefaultTileLayer';
import { getMapOptions } from './options';
import { isSiteWithPosition, Site, siteToLatLng, SiteWithPosition } from './site';
import { invalidateSizeAfterDimensionsChange, WidgetDimensions } from './widget-dimensions';

declare global {
    namespace Stage.Common.Map {
        export {
            WidgetDimensions,
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
        getMapOptions,
        isSiteWithPosition,
        siteToLatLng,
        DefaultTileLayer
    }
});
