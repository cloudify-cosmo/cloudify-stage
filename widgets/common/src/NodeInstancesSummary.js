function StateDescription({ states, value }) {
    const state = _.join(states, ', ');
    const areManyStates = _.size(_.words(state)) > 1;

    return (
        <p>
            <strong>{value}</strong> node instances in <strong>{state}</strong> state{areManyStates && 's'}
        </p>
    );
}
StateDescription.propTypes = {
    states: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.number.isRequired
};

export default function NodeInstancesSummary({ instancesStates }) {
    const { Grid } = Stage.Basic;
    const { GroupState, NodeInstancesConsts } = Stage.Common;

    return (
        <Grid columns={_.size(NodeInstancesConsts.groupStates)}>
            <Grid.Row>
                {_.map(NodeInstancesConsts.groupStates, group => {
                    const value = _.sum(
                        _.map(group.states, state => (_.isNumber(instancesStates[state]) ? instancesStates[state] : 0))
                    );
                    return (
                        <Grid.Column key={group.name} textAlign="center">
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

NodeInstancesSummary.propTypes = {
    instancesStates: PropTypes.objectOf(PropTypes.number).isRequired
};

Stage.defineCommon({
    name: 'NodeInstancesSummary',
    common: NodeInstancesSummary
});
