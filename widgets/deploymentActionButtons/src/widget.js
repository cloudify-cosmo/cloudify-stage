/**
 * Created by jakubniezgoda on 01/03/2017.
 */

import DeploymentActionButtons from './DeploymentActionButtons';

Stage.defineWidget({
    id: 'deploymentActionButtons',
    name: 'Deployment action buttons',
    description: 'Provides set of action buttons for deployment',
    initialWidth: 8,
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

                    var dep = Object.assign({},deployment,{
                        workflows: _.sortBy(deployment.workflows,['name'])
                    });
                    return Promise.resolve(dep);
                });
        }

        return Promise.resolve(DeploymentActionButtons.EMPTY_DEPLOYMENT);
    },

    fetchParams: function(widget, toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');

        return {deployment_id: deploymentId};
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        return (
            <DeploymentActionButtons deployment={data} widget={widget} toolbox={toolbox} />
        );
    }

});