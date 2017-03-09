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
            return toolbox.getManager().doGet(`/deployments/${deploymentId}`)
                .then(deployment => Promise.resolve(deployment));
        }

        return Promise.resolve(DeploymentActionButtons.EMPTY_DEPLOYMENT);
    },

    render: function(widget,data,error,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');
        return (
            <DeploymentActionButtons deploymentId={deploymentId} data={data} widget={widget} toolbox={toolbox} />
        );
    }

});