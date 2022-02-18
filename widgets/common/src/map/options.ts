import type { LatLngBounds, MapOptions } from 'leaflet';
import { siteToLatLng, SiteWithPosition } from './site';

export function getMapOptions(sites: SiteWithPosition[]): { options: MapOptions; bounds?: LatLngBounds } {
    const { initialZoom, mapOptions: defaultMapOptions } = Stage.Common.Consts.leaflet;
    const mapOptions: MapOptions = { ...defaultMapOptions };
    let bounds: LatLngBounds | undefined;

    switch (sites.length) {
        case 0:
            mapOptions.center = [0, 0];
            mapOptions.zoom = initialZoom;
            break;

        case 1:
            mapOptions.center = siteToLatLng(sites[0]);
            mapOptions.zoom = initialZoom;
            break;

        default:
            bounds = window.L.latLngBounds(sites.map(siteToLatLng)).pad(0.05);
            break;
    }

    return {
        options: mapOptions,
        bounds
    };
}
