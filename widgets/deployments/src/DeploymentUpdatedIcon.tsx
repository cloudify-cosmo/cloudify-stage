// @ts-nocheck File not migrated fully to TS

export default function DeploymentUpdatedIcon({ className, deployment }) {
    const { Icon, Popup } = Stage.Basic;

    return deployment.isUpdated ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon.Group size="large" className={className} style={{ marginLeft: '6px', marginTop: '-4px' }}>
                    <Icon name="cube" color="blue" />
                    <Icon corner name="refresh" color="blue" />
                </Icon.Group>
            </Popup.Trigger>
            <Popup.Header>Deployment updated</Popup.Header>
            <Popup.Content>
                <p>This deployment has been updated at least once since creation.</p>
                <p>
                    Last update was on: <strong>{deployment.updated_at}</strong>.
                </p>
            </Popup.Content>
        </Popup>
    ) : null;
}

DeploymentUpdatedIcon.propTypes = {
    deployment: PropTypes.shape({ isUpdated: PropTypes.bool, updated_at: PropTypes.string }),
    className: PropTypes.string
};

DeploymentUpdatedIcon.defaultProps = {
    deployment: { isUpdated: false, updated_at: null },
    className: ''
};
