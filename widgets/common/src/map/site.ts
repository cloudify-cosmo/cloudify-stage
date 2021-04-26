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

export function siteToLatLng(site: SiteWithPosition): [number, number] {
    return [site.latitude, site.longitude];
}
