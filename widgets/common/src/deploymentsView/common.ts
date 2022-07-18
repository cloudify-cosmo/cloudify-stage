import type { SemanticICONS } from 'semantic-ui-react';
import type { DeploymentContext } from './types';

export const i18nPrefix = 'widgets.deploymentsView';
export const i18nMessagesPrefix = `${i18nPrefix}.messages`;
export const i18nDrillDownPrefix = `${i18nPrefix}.drillDown`;

export const subenvironmentsIcon: SemanticICONS = 'object group';
export const subservicesIcon: SemanticICONS = 'cube';

export const filterRulesContextKey = 'filterRules';
export const mapOpenContextKey = 'mapOpen';
export const parentDeploymentIdContextKey = 'parentDeploymentId';

export const parentDeploymentLabelKey = 'csys-obj-parent';

export const hasParentDeployment = (context: DeploymentContext) => {
    return context?.[parentDeploymentIdContextKey];
};

export const selectDeployment = (toolbox: Stage.Types.Toolbox, deploymentId: string) =>
    toolbox.getContext().setValue('deploymentId', deploymentId);
