// @ts-nocheck File not migrated fully to TS
export default function DeploymentInfo({ data, toolbox }) {
    const { deployment, instancesCount, instancesStates } = data;
    const [visibilityError, setVisibilityError] = React.useState('');

    const { ErrorMessage } = Stage.Basic;
    const DeploymentDetails = Stage.Common.Deployments.Details;

    const setVisibility = (id, visibility) => {
        const DeploymentActions = Stage.Common.Deployments.Actions;
        const actions = new DeploymentActions(toolbox);

        toolbox.loading(true);
        return actions
            .doSetVisibility(id, visibility)
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
                onSetVisibility={visibility => setVisibility(deployment.id, visibility)}
                toolbox={toolbox}
            />
        </div>
    );
}

DeploymentInfo.propTypes = {
    data: PropTypes.shape({
        deployment: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired,
        instancesCount: PropTypes.number.isRequired,
        instancesStates: PropTypes.objectOf(PropTypes.number).isRequired
    }).isRequired,
    toolbox: PropTypes.shape({
        loading: PropTypes.func,
        refresh: PropTypes.func
    }).isRequired
};
