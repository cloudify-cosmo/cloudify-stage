export default function DeploymentInfo({ data, toolbox }) {
    const { deployment, instancesCount, instancesStates } = data;
    const [visibilityError, setVisibilityError] = React.useState('');

    const { ErrorMessage } = Stage.Basic;
    const { DeploymentDetails } = Stage.Common;

    const setVisibility = (id, visibility) => {
        const { DeploymentActions } = Stage.Common;
        const actions = new DeploymentActions(toolbox);

        toolbox.loading(true);
        return actions
            .doSetVisibility(id, visibility)
            .then(() => {
                toolbox.loading(false);
                toolbox.refresh();
            })
            .catch(err => {
                toolbox.loading(false);
                setVisibilityError(err.message);
            });
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
