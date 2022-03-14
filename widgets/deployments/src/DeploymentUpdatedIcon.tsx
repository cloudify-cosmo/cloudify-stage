interface DeploymentUpdatedIconProps {
    deployment: {
        isUpdated: boolean;
        updated_at: string | null;
    };
}

const defaultDeployment: DeploymentUpdatedIconProps['deployment'] = {
    isUpdated: false,
    updated_at: null
};

export default function DeploymentUpdatedIcon({ deployment = defaultDeployment }: DeploymentUpdatedIconProps) {
    const { Icon, Popup } = Stage.Basic;

    return deployment.isUpdated ? (
        <Popup wide on="hover">
            <Popup.Trigger>
                <Icon.Group size="large" style={{ marginLeft: '6px', marginTop: '-4px' }}>
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
