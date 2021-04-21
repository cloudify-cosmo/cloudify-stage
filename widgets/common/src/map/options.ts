import type { LatLngBounds, MapOptions } from 'leaflet';
import { siteToLatLng, SiteWithPosition } from './site';

// eslint-disable-next-line import/prefer-default-export
export function getMapOptions(sites: SiteWithPosition[]): { options: MapOptions; bounds?: LatLngBounds } {
    const { initialZoom, mapOptions: defaultMapOptions } = Stage.Common.Consts.leaflet;
    const mapOptions: MapOptions = { ...defaultMapOptions };
    let bounds: LatLngBounds | undefined;

    if (sites.length > 1) {
        bounds = L.latLngBounds(sites.map(siteToLatLng)).pad(0.05);
    } else {
        mapOptions.center = siteToLatLng(sites[0]);
        mapOptions.zoom = initialZoom;
    }

    return {
        options: mapOptions,
        bounds
    };
}
