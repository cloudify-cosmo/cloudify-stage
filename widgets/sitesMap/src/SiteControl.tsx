import type { FunctionComponent } from 'react';
import type { DeploymentStatus, DeploymentStatusesSummary } from './types';
import groupStates from './groupStates';

interface SiteControlProps {
    site: {
        name: string;
        statusesSummary: DeploymentStatusesSummary;
    };
    toolbox: Stage.Types.Toolbox;
}
const SiteControl: FunctionComponent<SiteControlProps> = ({ site, toolbox }) => {
    function goToDeploymentsPage(siteName: string) {
        toolbox.drillDown(toolbox.getWidget(), 'deploy', { siteName }, `Site: ${siteName}`);
    }

    const { Grid } = Stage.Basic;
    const { GroupState } = Stage.Common.Components;

    return (
        <span>
            <SiteName name={site.name} />
            <Grid columns={3} container>
                <Grid.Row>
                    {_.map(groupStates, (state, stateKey: DeploymentStatus) => {
                        const value = site.statusesSummary[stateKey];
                        const description = <StateDescription description={state.description} value={value} />;
                        return (
                            <Grid.Column key={state.name} textAlign="center" className="deploymentState">
                                <GroupState
                                    state={state}
                                    value={value}
                                    className="deploymentState"
                                    onClick={() => goToDeploymentsPage(site.name)}
                                    description={description}
                                />
                            </Grid.Column>
                        );
                    })}
                </Grid.Row>
            </Grid>
        </span>
    );
};
export default SiteControl;

interface SiteNameProps {
    name: string;
}
const SiteName: FunctionComponent<SiteNameProps> = ({ name }) => {
    const maxNameLength = 50;
    const { Popup, Header } = Stage.Basic;
    const nameHeader = (header: string) => (
        <Header as="h5" className="ui header dividing">
            {header}
        </Header>
    );
    if (name.length < maxNameLength) {
        return nameHeader(name);
    }

    return <Popup content={name} trigger={nameHeader(`${name.slice(0, maxNameLength - 3)}...`)} />;
};

interface StateDescriptionProps {
    description: string;
    value: number;
}
const StateDescription: FunctionComponent<StateDescriptionProps> = ({ description, value }) => {
    return (
        <span>
            <strong>{value}</strong> {description}
        </span>
    );
};
