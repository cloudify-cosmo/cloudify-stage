import { i18nPrefix } from '../common';
import type { Deployment } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const mapT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.map.${suffix}`);

export interface DeploymentSitePair {
    deployment: Deployment;
    site: Stage.Common.Map.SiteWithPosition;
}
