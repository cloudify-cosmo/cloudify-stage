import type { SemanticICONS } from 'semantic-ui-react';

export const i18nPrefix = 'widgets.deploymentsView';
export const i18nMessagesPrefix = `${i18nPrefix}.messages`;
export const i18nDrillDownPrefix = `${i18nPrefix}.drillDown`;

export const subenvironmentsIcon: SemanticICONS = 'object group';
export const subservicesIcon: SemanticICONS = 'cube';

export const filterRulesContextKey = 'filterRules';
export const mapOpenContextKey = 'mapOpen';
export const parentDeploymentIdContextKey = 'parentDeploymentId';

export const parentDeploymentLabelKey = 'csys-obj-parent';

/**
 * NOTE: drilldownContext contains contexts for each page, starting with
 * the top-level page, and ending with the current page's initial context.
 *
 * Thus, the current page's parent context will be the penultimate entry in the array.
 *
 * It may happen, that the array only contains a single item (if we are on the top-level page).
 */
// TODO Norbert: Adjust function with its description
export const isTopLevelPage = (context: Stage.Types.ReduxState['context']) => {
    return !(context as any)?.[parentDeploymentIdContextKey];
};

export const selectDeployment = (toolbox: Stage.Types.Toolbox, deploymentId: string) =>
    toolbox.getContext().setValue('deploymentId', deploymentId);
