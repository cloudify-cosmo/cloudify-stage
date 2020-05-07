/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';
import ExecutionProgress from './ExecutionProgress';

export default class DeploymentsSegment extends React.Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        widget: PropTypes.object.isRequired,
        fetchData: PropTypes.func,
        onSelectDeployment: PropTypes.func,
        onShowLogs: PropTypes.func,
        onShowUpdateDetails: PropTypes.func,
        onActOnExecution: PropTypes.func,
        onMenuAction: PropTypes.func,
        onError: PropTypes.func,
        onSetVisibility: PropTypes.func,
        allowedSettingTo: PropTypes.array,
        noDataMessage: PropTypes.string,
        showExecutionStatusLabel: PropTypes.bool
    };

    static defaultProps = {
        fetchData: () => {},
        onSelectDeployment: () => {},
        onShowLogs: () => {},
        onShowUpdateDetails: () => {},
        onActOnExecution: () => {},
        onMenuAction: () => {},
        onError: () => {},
        onSetVisibility: () => {},
        allowedSettingTo: ['tenant', 'global'],
        noDataMessage: '',
        showExecutionStatusLabel: false
    };

    render() {
        const { DataSegment, Divider, Grid, Header, ResourceVisibility } = Stage.Basic;
        const { NodeInstancesConsts, LastExecutionStatusIcon, GroupState } = Stage.Common;

        return (
            <DataSegment
                totalSize={this.props.data.total}
                pageSize={this.props.widget.configuration.pageSize}
                fetchData={this.props.fetchData}
                searchable
                noDataMessage={this.props.noDataMessage}
            >
                {this.props.data.items.map(item => {
                    return (
                        <DataSegment.Item
                            key={item.id}
                            selected={item.isSelected}
                            className={item.id}
                            onClick={() => this.props.onSelectDeployment(item)}
                        >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <LastExecutionStatusIcon
                                            execution={item.lastExecution}
                                            onShowLogs={() => this.props.onShowLogs(item.id, item.lastExecution.id)}
                                            onShowUpdateDetails={this.props.onShowUpdateDetails}
                                            onActOnExecution={this.props.onActOnExecution}
                                            showLabel={this.props.showExecutionStatusLabel}
                                        />
                                        <ResourceVisibility
                                            visibility={item.visibility}
                                            className="rightFloated"
                                            onSetVisibility={visibility =>
                                                this.props.onSetVisibility(item.id, visibility)
                                            }
                                            allowedSettingTo={this.props.allowedSettingTo}
                                        />
                                        {this.props.showExecutionStatusLabel && <Divider hidden />}
                                        <Header
                                            as="h3"
                                            textAlign="center"
                                            style={this.props.showExecutionStatusLabel ? {} : { marginTop: 5 }}
                                        >
                                            <a href="javascript:void(0)" className="breakWord">
                                                {item.id}
                                            </a>
                                        </Header>
                                    </Grid.Column>

                                    <Grid.Column width={2}>
                                        <Header as="h5">Blueprint</Header>
                                        <span>{item.blueprint_id}</span>
                                    </Grid.Column>

                                    <Grid.Column width={2}>
                                        <Header as="h5">Site Name</Header>
                                        <span>{item.site_name}</span>
                                    </Grid.Column>

                                    <Grid.Column width={2}>
                                        <Header as="h5">Created</Header>
                                        <span>
                                            {item.created_at}
                                            <DeploymentUpdatedIcon deployment={item} />
                                        </span>
                                    </Grid.Column>

                                    <Grid.Column width={2}>
                                        <Header as="h5">Creator</Header>
                                        <span>{item.created_by}</span>
                                    </Grid.Column>

                                    <Grid.Column width={3}>
                                        <Header as="h5">Node Instances ({item.nodeInstancesCount})</Header>
                                        <Grid columns={4}>
                                            <Grid.Row>
                                                {_.map(NodeInstancesConsts.groupStates, groupState => {
                                                    const value = _.sum(
                                                        _.map(groupState.states, state =>
                                                            _.isNumber(item.nodeInstancesStates[state])
                                                                ? item.nodeInstancesStates[state]
                                                                : 0
                                                        )
                                                    );
                                                    return (
                                                        <Grid.Column key={groupState.name} textAlign="center">
                                                            <GroupState
                                                                state={groupState}
                                                                description={
                                                                    <StateDescription
                                                                        states={groupState.states}
                                                                        value={value}
                                                                    />
                                                                }
                                                                className="nodeState"
                                                                value={value}
                                                            />
                                                        </Grid.Column>
                                                    );
                                                })}
                                            </Grid.Row>
                                        </Grid>
                                    </Grid.Column>

                                    <Grid.Column width={1}>
                                        <MenuAction item={item} onSelectAction={this.props.onMenuAction} />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <ExecutionProgress
                                execution={item.lastExecution}
                                instancesCount={item.nodeInstancesCount}
                                instancesStates={item.nodeInstancesStates}
                            />
                        </DataSegment.Item>
                    );
                })}
            </DataSegment>
        );
    }
}

function StateDescription({ states, value }) {
    const state = _.join(states, ', ');
    const areManyStates = _.size(_.words(state)) > 1;

    return (
        <span>
            <strong>{value}</strong> node instances in <strong>{state}</strong> state{areManyStates && 's'}
        </span>
    );
}
