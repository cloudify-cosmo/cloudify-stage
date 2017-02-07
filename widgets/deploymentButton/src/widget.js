/**
 * Created by pawelposel on 03/11/2016.
 */
import DeploymentButton from './DeploymentButton';

Stage.defineWidget({
    id: "deploymentButton",
    name: "New deployment button",
    description: 'Create new deployment',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    isReact: true,

    render: function(widget,data,error,toolbox) {
        return (
            <DeploymentButton widget={widget} toolbox={toolbox}></DeploymentButton>
        );
    }

});