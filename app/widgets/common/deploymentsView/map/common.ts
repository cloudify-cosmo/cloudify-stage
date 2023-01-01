import i18n from 'i18next';
import type { SiteWithPosition } from '../../map/site';
import { i18nPrefix } from '../common';
import type { Deployment } from '../types';

export const tMap = (suffix: string) => i18n.t(`${i18nPrefix}.map.${suffix}`);

export interface DeploymentSitePair {
    deployment: Deployment;
    site: SiteWithPosition;
}
