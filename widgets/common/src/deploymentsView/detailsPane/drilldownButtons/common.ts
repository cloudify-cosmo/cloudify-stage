import { i18nDrillDownPrefix } from '../../common';
import { SubdeploymentsResult } from './subdeployments-result';

const i18nDrillDownButtonsPrefix = `${i18nDrillDownPrefix}.buttons`;

export const tDrillDownButtons = Stage.Utils.getT(i18nDrillDownButtonsPrefix);

export const shouldDisplaySubdeploymentButton = (buttonsData: SubdeploymentsResult) => {
    return !buttonsData.loading && buttonsData.count > 0;
};
