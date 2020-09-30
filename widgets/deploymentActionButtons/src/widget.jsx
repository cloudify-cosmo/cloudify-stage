/**
 * Created by jakubniezgoda on 01/03/2017.
 */

import DeploymentActionButtons from './DeploymentActionButtons';

Stage.defineWidget({
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

    fetchData(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');

        if (!_.isEmpty(deploymentId)) {
            toolbox.loading(true);
            return toolbox
                .getManager()
                .doGet(`/deployments/${deploymentId}`)
                .then(deployment => {
                    toolbox.loading(false);
                    const workflows = Stage.Common.DeploymentUtils.filterWorkflows(
                        _.sortBy(deployment.workflows, ['name'])
                    );

                    return Promise.resolve({ ...deployment, workflows });
                });
        }

        return Promise.resolve(DeploymentActionButtons.EMPTY_DEPLOYMENT);
    },

    fetchParams(widget, toolbox) {
        const deploymentId = toolbox.getContext().getValue('deploymentId');

        return { deployment_id: deploymentId };
    },

    render(widget, data, error, toolbox) {
        const { Loading } = Stage.Basic;

        if (_.isEmpty(data)) {
            return <Loading />;
        }

        return <DeploymentActionButtons deployment={data} widget={widget} toolbox={toolbox} />;
    }
});
