import { castArray } from 'lodash';
import type { ComponentProps } from 'react';
import DeploymentActionButtons from './DeploymentActionButtons';
import { widgetId } from './widget.consts';
import { translateWidget } from './widget.utils';

interface WidgetParams {
    id: string | null | undefined;
}
type UnwrapPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;
type WidgetData =
    | UnwrapPromise<ReturnType<InstanceType<typeof Stage.Common.Deployments.Actions>['doGetWorkflowsAndLabels']>>
    | Error;
interface WidgetConfiguration {
    preventRedirectToParentPageAfterDelete?: boolean;
}

Stage.defineWidget<WidgetParams, WidgetData, WidgetConfiguration>({
    id: widgetId,
    initialWidth: 5,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(5),
        {
            // NOTE: for programmatic use only, not exposed in the UI
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            hidden: true,
            id: 'preventRedirectToParentPageAfterDelete',
            default: false
        }
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentActionButtons'),

    fetchData(_widget, toolbox, { id }) {
        if (!id) {
            return Promise.resolve(new Error(translateWidget('errors.fetchData')));
        }

        const DeploymentActions = Stage.Common.Deployments.Actions;
        const actions = new DeploymentActions(toolbox.getManager());

        return actions.doGetWorkflowsAndLabels(id);
    },

    fetchParams(_widget, toolbox): WidgetParams {
        return { id: getDeploymentIdFromContext(toolbox) };
    },

    render(widget, data, _error, toolbox) {
        const fetchedDeploymentState: ComponentProps<
            typeof DeploymentActionButtons
            // eslint-disable-next-line no-nested-ternary
        >['fetchedDeploymentState'] = Stage.Utils.isEmptyWidgetData(data)
            ? { status: 'loading' }
            : data instanceof Error
            ? { status: 'error', error: data }
            : { status: 'success', data };

        return (
            <DeploymentActionButtons
                deploymentId={getDeploymentIdFromContext(toolbox)}
                fetchedDeploymentState={fetchedDeploymentState}
                toolbox={toolbox}
                redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
            />
        );
    }
});

const getDeploymentIdFromContext = (toolbox: Stage.Types.Toolbox) => {
    const deploymentId = toolbox.getContext().getValue('deploymentId');
    // Deployment Actions Buttons widget does not support multiple actions, thus picking only one deploymentId
    const firstDeploymentId = castArray(deploymentId)[0] as WidgetParams['id'];

    return firstDeploymentId;
};
