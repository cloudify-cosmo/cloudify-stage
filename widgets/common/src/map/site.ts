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

const siteLatLngMap = new WeakMap<SiteWithPosition, [number, number]>();

/**
 * Gets the latitude and longitude of the site.
 * Maintains stable references for the results.
 * Assumes immutability of the `site` argument (its position will not be mutated)
 */
export function siteToLatLng(site: SiteWithPosition): [number, number] {
    const latLng = siteLatLngMap.get(site);
    if (latLng) {
        return latLng;
    }

    const newLatLng: [number, number] = [site.latitude, site.longitude];
    siteLatLngMap.set(site, newLatLng);

    return newLatLng;
}
