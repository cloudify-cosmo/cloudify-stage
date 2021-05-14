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
    return typeof site.latitude === 'number' && typeof site.longitude === 'number';
}

function pureSiteToLatLng(site: SiteWithPosition): [number, number] {
    return [site.latitude, site.longitude];
}

/**
 * Gets the latitude and longitude of the site.
 * Maintains stable references for the results.
 * Assumes immutability of the `site` argument (its position will not be mutated)
 */
export const siteToLatLng = Stage.Utils.memoizeWithWeakMap(pureSiteToLatLng);
