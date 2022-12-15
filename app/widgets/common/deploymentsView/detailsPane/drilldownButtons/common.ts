import { i18nDrillDownPrefix } from '../../common';
import type { SubdeploymentsResult } from './subdeployments-result';
import StageUtils from '../../../../../utils/stageUtils';

const i18nDrillDownButtonsPrefix = `${i18nDrillDownPrefix}.buttons`;

export const tDrillDownButtons = StageUtils.getT(i18nDrillDownButtonsPrefix);

export const shouldDisplaySubdeploymentButton = (result: SubdeploymentsResult) => {
    return !result.loading && result.count > 0;
};
