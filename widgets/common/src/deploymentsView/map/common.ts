import { i18nPrefix } from '../common';

export interface Site {
    name: string;
    latitude: number | null;
    longitude: number | null;
}

export const mapT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.map.${suffix}`);
