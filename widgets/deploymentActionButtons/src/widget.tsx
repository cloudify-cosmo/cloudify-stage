import { castArray } from 'lodash';
import type { ComponentProps } from 'react';
import DeploymentActionButtons from './DeploymentActionButtons';

interface WidgetParams {
    id: string | null | undefined;
}
type WidgetData = ComponentProps<typeof DeploymentActionButtons>['deployment'];
interface WidgetConfiguration {
    preventRedirectToParentPageAfterDelete?: boolean;
}

Stage.defineWidget<WidgetParams, WidgetData, WidgetConfiguration>({
    id: 'deploymentActionButtons',
    name: 'Deployment action buttons',
    description: 'Provides set of action buttons for deployment',
    initialWidth: 5,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [
        {
            // NOTE: for programmatic use only, not exposed in the UI
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            hidden: true,
            id: 'preventRedirectToParentPageAfterDelete',
            default: false
        }
    ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentActionButtons'),

    fetchData(_widget, toolbox, { id }) {
        if (!id) {
            return Promise.resolve({ id: '', workflows: [] });
        }

        const { DeploymentActions } = Stage.Common;
        const actions = new DeploymentActions(toolbox);

        return actions.doGetWorkflows(id);
    },

    fetchParams(_widget, toolbox): WidgetParams {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        // Deployment Actions Buttons widget does not support multiple actions, thus picking only one deploymentId
        const firstDeploymentId = castArray(deploymentId)[0] as WidgetParams['id'];

        return { id: firstDeploymentId };
    },

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        // TODO(RD-1827): move the loading indicator to the individual buttons, so they are always shown
        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        return (
            <DeploymentActionButtons
                deployment={data}
                toolbox={toolbox}
                redirectToParentPageAfterDelete={!widget.configuration.preventRedirectToParentPageAfterDelete}
            />
        );
    }
});
