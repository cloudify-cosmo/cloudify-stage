import InfoElement from './InfoElement';

export default function DeploymentInfo({ deployment, instancesCount, instancesStates }) {
    const { Grid, ResourceVisibility, Message } = Stage.Basic;
    const { NodeInstancesSummary } = Stage.Common;

    if (!('id' in deployment)) {
        return <Message info>No deployment selected</Message>;
    }

    const showBlueprint = 'blueprint_id' in deployment;
    const showSiteName = 'site_name' in deployment && !_.isEmpty(deployment.site_name);
    const showCreated = 'created_at' in deployment;
    const showUpdated = 'updated_at' in deployment;
    const showCreator = 'created_by' in deployment;
    const showNodeInstances = !_.isEmpty(instancesStates);

    return (
        <Grid>
            <Grid.Row>
                <Grid.Column width={4}>
                    <ResourceVisibility visibility={deployment.visibility} className="rightFloated" />
                    <InfoElement name={deployment.id} value={deployment.description} style={{ marginTop: 0 }} />
                </Grid.Column>
                {(showBlueprint || showSiteName) && (
                    <Grid.Column width={3}>
                        {showBlueprint && <InfoElement name="Blueprint" value={deployment.blueprint_id} />}
                        {showSiteName && <InfoElement name="Site Name" value={deployment.site_name} />}
                    </Grid.Column>
                )}
                {(showCreated || showUpdated) && (
                    <Grid.Column width={3}>
                        {showCreated && <InfoElement name="Created" value={deployment.created_at} />}
                        {showUpdated && <InfoElement name="Updated" value={deployment.updated_at} />}
                    </Grid.Column>
                )}
                {showCreator && (
                    <Grid.Column width={2}>
                        <InfoElement name="Creator" value={deployment.created_by} />
                    </Grid.Column>
                )}
                {showNodeInstances && (
                    <Grid.Column width={4}>
                        <InfoElement
                            name={`Node Instances (${instancesCount})`}
                            value={<NodeInstancesSummary instancesStates={instancesStates} />}
                        />
                    </Grid.Column>
                )}
            </Grid.Row>
        </Grid>
    );
}

DeploymentInfo.propTypes = {
    deployment: PropTypes.shape({
        id: PropTypes.string,
        blueprint_id: PropTypes.string,
        description: PropTypes.string,
        site_name: PropTypes.string,
        visibility: PropTypes.string,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
        created_by: PropTypes.string
    }),
    instancesCount: PropTypes.number,
    instancesStates: PropTypes.objectOf(PropTypes.number)
};

DeploymentInfo.defaultProps = {
    deployment: {},
    instancesCount: 0,
    instancesStates: {}
};
