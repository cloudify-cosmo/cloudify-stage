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
        const {
            allowedSettingTo,
            data,
            fetchData,
            noDataMessage,
            onActOnExecution,
            onMenuAction,
            onSelectDeployment,
            onSetVisibility,
            onShowLogs,
            onShowUpdateDetails,
            showExecutionStatusLabel,
            widget
        } = this.props;
        const { DataSegment, Divider, Grid, Header, ResourceVisibility } = Stage.Basic;
        const { LastExecutionStatusIcon, NodeInstancesSummary } = Stage.Common;

        return (
            <DataSegment
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                fetchData={fetchData}
                searchable
                noDataMessage={noDataMessage}
            >
                {data.items.map(item => {
                    return (
                        <DataSegment.Item
                            key={item.id}
                            selected={item.isSelected}
                            className={item.id}
                            onClick={() => onSelectDeployment(item)}
                        >
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={4}>
                                        <LastExecutionStatusIcon
                                            execution={item.lastExecution}
                                            onShowLogs={() => onShowLogs(item.id, item.lastExecution.id)}
                                            onShowUpdateDetails={onShowUpdateDetails}
                                            onActOnExecution={onActOnExecution}
                                            showLabel={showExecutionStatusLabel}
                                        />
                                        <ResourceVisibility
                                            visibility={item.visibility}
                                            className="rightFloated"
                                            onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                                            allowedSettingTo={allowedSettingTo}
                                        />
                                        {showExecutionStatusLabel && <Divider hidden />}
                                        <Header
                                            as="h3"
                                            textAlign="center"
                                            style={showExecutionStatusLabel ? {} : { marginTop: 5 }}
                                        >
                                            <span className="breakWord">{item.id}</span>
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
                                        <NodeInstancesSummary instancesStates={item.nodeInstancesStates} />
                                    </Grid.Column>

                                    <Grid.Column width={1}>
                                        <MenuAction item={item} onSelectAction={onMenuAction} />
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
