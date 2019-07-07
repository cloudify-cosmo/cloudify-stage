
export default class SiteControl extends React.Component {

    /**
     * propTypes
     * @property {object} site - the site details including the name and the deployment states
     * @property {object} toolbox - Toolbox object
     */
    static propTypes = {
        site: PropTypes.shape({
            name: PropTypes.string.isRequired,
            deploymentStates:  PropTypes.shape({
                pending: PropTypes.array.isRequired,
                inProgress: PropTypes.array.isRequired,
                good: PropTypes.array.isRequired,
                failed: PropTypes.array.isRequired
            }).isRequired
        }).isRequired,
        toolbox: PropTypes.object.isRequired
    };

    _goToDeploymentsPage(siteName) {
        return new Promise((resolve) => {
            resolve(this.props.toolbox.goToPage('deployments'));
        }).then(() => this.props.toolbox.getContext().setValue('siteName', siteName));
    }

    render() {
        const {Grid} = Stage.Basic;
        const site = this.props.site;
        const {DeploymentStates, GroupState} = Stage.Common;

        return (
            <span>
                <SiteName name={site.name}/>
                <Grid columns={4} container>
                    <Grid.Row>
                        {
                            _.map(DeploymentStates.groupStates, (state, stateKey) =>
                                {
                                    let value = site.deploymentStates[stateKey].length;
                                    let description = <StateDescription description={state.description} value={value}/>;
                                    return (
                                        <Grid.Column key={state.name} textAlign='center' className='deploymentState'>
                                            <GroupState state={state} value={value} className='deploymentState'
                                                        onClick={() => this._goToDeploymentsPage(site.name)}
                                                        description={description}/>
                                        </Grid.Column>
                                    );
                                }
                            )
                        }
                    </Grid.Row>
                </Grid>
            </span>
        );
    }
};

function SiteName({name}){
    const maxNameLength = 50;
    const { Popup, Header } = Stage.Basic;
    const nameHeader = (name) => <Header as='h5' className='ui header dividing'>{name}</Header>;
    if (name.length < maxNameLength) {
        return (nameHeader(name));
    }

    return (
        <Popup content={name} trigger={nameHeader(`${name.slice(0, maxNameLength - 3)}...`)}/>
    );
}

function StateDescription({description, value}) {
    return (
        <span>
            <strong>{value}</strong> {description}
        </span>
    );
}
