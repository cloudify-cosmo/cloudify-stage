import type { Visibility } from 'app/widgets/common/types';
import type { DeploymentInfoWidget } from './widget.types';

const { ErrorPopup } = Stage.Shared;
const { useResettableState } = Stage.Hooks;

const DeploymentDetails = Stage.Common.Deployments.Details;
const DeploymentActions = Stage.Common.Deployments.Actions;

interface DeploymentsInfoProps {
    data: DeploymentInfoWidget.Data;
    toolbox: Stage.Types.Toolbox;
}

export default function DeploymentInfo({ data, toolbox }: DeploymentsInfoProps) {
    const { deployment, instancesCount, instancesStates } = data;
    const [visibilityError, setVisibilityError, clearVisibilityError] = useResettableState('');

    const setVisibility = (visibility: Visibility) => {
        const actions = new DeploymentActions(toolbox.getManager());

        toolbox.loading(true);
        return actions
            .doSetVisibility(deployment.id, visibility)
            .then(() => toolbox.refresh())
            .catch(err => setVisibilityError(err.message))
            .finally(() => toolbox.loading(false));
    };

    return (
        <ErrorPopup
            trigger={
                <DeploymentDetails
                    big
                    deployment={deployment}
                    instancesCount={instancesCount}
                    instancesStates={instancesStates}
                    onSetVisibility={setVisibility}
                />
            }
            onDismiss={clearVisibilityError}
            content={visibilityError}
            open={!!visibilityError}
        />
    );
}
