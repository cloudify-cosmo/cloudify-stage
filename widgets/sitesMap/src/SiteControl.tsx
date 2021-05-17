import { FunctionComponent } from 'react';
import type { DeploymentStates } from './types';

interface SiteControlProps {
    site: {
        name: string;
        deploymentStates: DeploymentStates;
    };
    toolbox: Stage.Types.Toolbox;
}
const SiteControl: FunctionComponent<SiteControlProps> = ({ site, toolbox }) => {
    function goToDeploymentsPage(siteName: string) {
        toolbox.goToPage('deployments', { siteName });
    }

    const { Grid } = Stage.Basic;
    // @ts-expect-error GroupState is not converted to TS yet
    const { GroupState } = Stage.Common;

    return (
        <span>
            <SiteName name={site.name} />
            <Grid columns={3} container>
                <Grid.Row>
                    {_.map(groupStates, (state, stateKey: Stage.Common.DeploymentsView.Types.DeploymentStatus) => {
                        const value = site.deploymentStates[stateKey];
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

const { DeploymentStatus } = Stage.Common.DeploymentsView.Types;
type GroupState = { name: string; icon: string; colorSUI: string; severity: number; description: string };
const groupStates: Record<Stage.Common.DeploymentsView.Types.DeploymentStatus, GroupState> = {
    [DeploymentStatus.Good]: {
        name: 'good',
        icon: 'checkmark',
        colorSUI: 'green',
        severity: 1,
        description: 'deployments with all nodes successfully started' // TODO: Update description
    },
    [DeploymentStatus.InProgress]: {
        name: 'in progress',
        icon: 'spinner',
        colorSUI: 'yellow',
        severity: 2,
        description: 'deployments in which active workflow execution is performed' // TODO: Update description
    },
    [DeploymentStatus.RequiresAttention]: {
        name: 'failed',
        icon: 'close',
        colorSUI: 'red',
        severity: 4,
        description: 'deployments with failed workflow execution' // TODO: Update description
    }
};
