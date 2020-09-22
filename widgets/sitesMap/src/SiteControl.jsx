export default class SiteControl extends React.Component {
    goToDeploymentsPage(siteName) {
        const { toolbox } = this.props;
        return new Promise(resolve => {
            resolve(toolbox.goToPage('deployments'));
        }).then(() => toolbox.getContext().setValue('siteName', siteName));
    }

    render() {
        const { Grid } = Stage.Basic;
        const { site } = this.props;
        const { DeploymentStates, GroupState } = Stage.Common;

        return (
            <span>
                <SiteName name={site.name} />
                <Grid columns={4} container>
                    <Grid.Row>
                        {_.map(DeploymentStates.groupStates, (state, stateKey) => {
                            const value = site.deploymentStates[stateKey].length;
                            const description = <StateDescription description={state.description} value={value} />;
                            return (
                                <Grid.Column key={state.name} textAlign="center" className="deploymentState">
                                    <GroupState
                                        state={state}
                                        value={value}
                                        className="deploymentState"
                                        onClick={() => this.goToDeploymentsPage(site.name)}
                                        description={description}
                                    />
                                </Grid.Column>
                            );
                        })}
                    </Grid.Row>
                </Grid>
            </span>
        );
    }
}

SiteControl.propTypes = {
    site: PropTypes.shape({
        name: PropTypes.string.isRequired,
        deploymentStates: PropTypes.shape({
            pending: PropTypes.array.isRequired,
            inProgress: PropTypes.array.isRequired,
            good: PropTypes.array.isRequired,
            failed: PropTypes.array.isRequired
        }).isRequired
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

function SiteName({ name }) {
    const maxNameLength = 50;
    const { Popup, Header } = Stage.Basic;
    const nameHeader = name => (
        <Header as="h5" className="ui header dividing">
            {name}
        </Header>
    );
    if (name.length < maxNameLength) {
        return nameHeader(name);
    }

    return <Popup content={name} trigger={nameHeader(`${name.slice(0, maxNameLength - 3)}...`)} />;
}

SiteName.propTypes = { name: PropTypes.string.isRequired };

function StateDescription({ description, value }) {
    return (
        <span>
            <strong>{value}</strong> {description}
        </span>
    );
}

StateDescription.propTypes = { description: PropTypes.string.isRequired, value: PropTypes.number.isRequired };
