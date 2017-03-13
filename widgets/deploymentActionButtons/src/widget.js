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
    initialConfiguration: [],
    isReact: true,

    fetchData: function(widget,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');

        if (!_.isEmpty(deploymentId)) {
            toolbox.loading(true);
            return toolbox.getManager().doGet(`/deployments/${deploymentId}`)
                .then(deployment => {
                    toolbox.loading(false);
                    return Promise.resolve(deployment);
                });
        }

        return Promise.resolve(DeploymentActionButtons.EMPTY_DEPLOYMENT);
    },

    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');

        return {deployment_id: deploymentId};
    },

    render: function(widget,data,error,toolbox) {
        return (
            <DeploymentActionButtons deployment={data} widget={widget} toolbox={toolbox} />
        );
    }

});