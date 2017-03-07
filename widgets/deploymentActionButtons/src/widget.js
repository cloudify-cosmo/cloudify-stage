/**
 * Created by jakubniezgoda on 01/03/2017.
 */

import DeploymentActionButtons from './DeploymentActionButtons';

Stage.defineWidget({
    id: 'deploymentActionButtons',
    name: 'Deployment actions buttons',
    description: 'Provides set of action buttons for deployment',
    initialWidth: 8,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    initialConfiguration: [],
    isReact: true,

    render: function(widget,data,error,toolbox) {
        let deploymentId = toolbox.getContext().getValue('deploymentId');
        return (
            <DeploymentActionButtons deploymentId={deploymentId} widget={widget} toolbox={toolbox} />
        );
    }

});