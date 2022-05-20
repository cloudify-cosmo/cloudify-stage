import type { DeploymentInfoWidget } from './widget.types';

const { ErrorMessage } = Stage.Basic;
const DeploymentDetails = Stage.Common.Deployments.Details;
const DeploymentActions = Stage.Common.Deployments.Actions;

interface DeploymentsInfoProps {
    data: DeploymentInfoWidget.Data;
    toolbox: Stage.Types.Toolbox;
}

export default function DeploymentInfo({ data, toolbox }: DeploymentsInfoProps) {
    const { deployment, instancesCount, instancesStates } = data;
    const [visibilityError, setVisibilityError] = React.useState('');

    const setVisibility = (visibility: string) => {
        const actions = new DeploymentActions(toolbox);

        toolbox.loading(true);
        return actions
            .doSetVisibility(deployment.id, visibility)
            .then(() => toolbox.refresh())
            .catch(err => setVisibilityError(err.message))
            .finally(() => toolbox.loading(false));
    };

    return (
        <div>
            {visibilityError && <ErrorMessage error={visibilityError} autoHide={false} />}
            <DeploymentDetails
                big
                deployment={deployment}
                instancesCount={instancesCount}
                instancesStates={instancesStates}
                onSetVisibility={setVisibility}
            />
        </div>
    );
}
