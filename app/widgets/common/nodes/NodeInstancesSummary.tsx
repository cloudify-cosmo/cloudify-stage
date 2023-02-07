import React from 'react';
import GroupState from '../components/GroupState';
import { groupStates } from './NodeInstancesConsts';

function StateDescription({ states, value }: { states: string[]; value: number }) {
    const state = _.join(states, ', ');
    const areManyStates = _.size(_.words(state)) > 1;

    return (
        <p>
            <strong>{value}</strong> node instances in <strong>{state}</strong> state{areManyStates && 's'}
        </p>
    );
}

export default function NodeInstancesSummary({
    instancesStates
}: {
    instancesStates: Record<string, number | unknown>;
}) {
    const { Grid } = Stage.Basic;

    return (
        <Grid columns="equal">
            <Grid.Row style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                {_.map(groupStates, group => {
                    const value = _.sum(
                        _.map(group.states, state => (_.isNumber(instancesStates[state]) ? instancesStates[state] : 0))
                    );
                    return (
                        <Grid.Column key={group.name} style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                            <GroupState
                                state={group}
                                description={<StateDescription states={group.states} value={value} />}
                                className="nodeState"
                                value={value}
                            />
                        </Grid.Column>
                    );
                })}
            </Grid.Row>
        </Grid>
    );
}
