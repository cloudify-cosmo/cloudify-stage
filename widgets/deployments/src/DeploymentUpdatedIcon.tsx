interface DeploymentUpdatedIconProps {
    deployment: {
        isUpdated: boolean;
        // eslint-disable-next-line camelcase
        updated_at: string | null;
    };
}

const defaultDeployment: DeploymentUpdatedIconProps['deployment'] = {
    isUpdated: false,
    updated_at: null
};

const translate = Stage.Utils.getT('widgets.deployments.updatedIcon');

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
            <Popup.Header>{translate('header')}</Popup.Header>
            <Popup.Content>
                <p>{translate('content.description')}</p>
                <p>
                    {translate('content.lastUpdate')}
                    <strong>{deployment.updated_at}</strong>.
                </p>
            </Popup.Content>
        </Popup>
    ) : null;
}
