import DefaultTileLayer from './DefaultTileLayer';
import MapsActions from './MapsActions';
import { createMarkerIcon } from './MarkerIcon';
import { getMapOptions } from './options';
import { isSiteWithPosition, siteToLatLng } from './site';
import { getWidgetDimensions, invalidateSizeAfterDimensionsChange, useWidgetDimensions } from './widget-dimensions';

export default {
    Actions: MapsActions,
    invalidateSizeAfterDimensionsChange,
    getWidgetDimensions,
    useWidgetDimensions,
    getMapOptions,
    isSiteWithPosition,
    siteToLatLng,
    DefaultTileLayer,
    createMarkerIcon
};
