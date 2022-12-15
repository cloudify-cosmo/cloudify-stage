import StageUtils from '../../../utils/stageUtils';

export interface Site {
    name: string;
    latitude: number | null;
    longitude: number | null;
}

export interface SiteWithPosition {
    name: string;
    latitude: number;
    longitude: number;
}

export function isSiteWithPosition(site: Site): site is SiteWithPosition {
    return Number.isFinite(site.latitude) && Number.isFinite(site.longitude);
}

function pureSiteToLatLng(site: SiteWithPosition): [number, number] {
    return [site.latitude, site.longitude];
}

/**
 * Gets the latitude and longitude of the site.
 * Maintains stable references for the results.
 * Assumes immutability of the `site` argument (its position will not be mutated)
 */
export const siteToLatLng = StageUtils.memoizeWithWeakMap(pureSiteToLatLng);
