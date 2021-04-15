import type { ComponentProps } from 'react';
import DeploymentActionButtons from './DeploymentActionButtons';

interface DeploymentActionsWidgetParams {
    id: string | null | undefined;
}
type DeploymentActionsWidgetData = ComponentProps<typeof DeploymentActionButtons>['deployment'];

Stage.defineWidget<DeploymentActionsWidgetParams, DeploymentActionsWidgetData, Record<never, any>>({
    id: 'deploymentActionButtons',
    name: 'Deployment action buttons',
    description: 'Provides set of action buttons for deployment',
    initialWidth: 5,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentActionButtons'),

    fetchData(_widget, toolbox, { id }) {
        if (!id) {
            return Promise.resolve({ id: '', workflows: [] });
        }

        const { DeploymentActions } = Stage.Common;
        const actions = new DeploymentActions(toolbox);

        toolbox.loading(true);
        return actions.doGetWorkflows(id).finally(() => toolbox.loading(false));
    },

    fetchParams(_widget, toolbox): { id: string | null } {
        const deploymentId = toolbox.getContext().getValue('deploymentId');
        // Deployment Actions Buttons widget does not support multiple actions, thus picking only one deploymentId
        const firstDeploymentId: string | undefined | null = _.castArray(deploymentId)[0];

        return { id: firstDeploymentId };
    },

    render(_widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        // TODO(RD-1827): move the loading indicator to the individual buttons, so they are always shown
        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Loading />;
        }

        return <DeploymentActionButtons deployment={data} toolbox={toolbox} />;
    }
});
