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
        const id = toolbox.getContext().getValue('deploymentId');

        if (!_.isEmpty(id)) {
            const { DeploymentActions, DeploymentUtils } = Stage.Common;
            const actions = new DeploymentActions(toolbox);

            toolbox.loading(true);

            return actions
                .doGet({ id }) // FIXME: Once RD-1353 is implemented, pass { _include: ['worflows'] } to doGet
                .then(deployment => {
                    const workflows = DeploymentUtils.filterWorkflows(_.sortBy(deployment.workflows, ['name']));
                    return { id, workflows };
                })
                .finally(() => toolbox.loading(false));
        }

        return Promise.resolve({ id: '', workflows: [] });
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

        return <DeploymentActionButtons deployment={data} toolbox={toolbox} />;
    }
});
