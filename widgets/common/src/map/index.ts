import { getMapOptions } from './options';
import { isSiteWithPosition, Site, SiteWithPosition } from './site';
import { invalidateSizeAfterDimensionsChange, WidgetDimensions } from './widget-dimensions';

declare global {
    namespace Stage.Common.Map {
        export {
            WidgetDimensions,
            Site,
            invalidateSizeAfterDimensionsChange,
            getMapOptions,
            isSiteWithPosition,
            SiteWithPosition
        };
    }
}

Stage.defineCommon({
    name: 'Map',
    common: {
        invalidateSizeAfterDimensionsChange,
        getMapOptions,
        isSiteWithPosition
    }
});
