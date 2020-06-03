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
        const { DataSegment, Divider, Header } = Stage.Basic;
        const { DeploymentDetails, LastExecutionStatusIcon } = Stage.Common;

        return (
            <DataSegment
                totalSize={data.total}
                pageSize={widget.configuration.pageSize}
                fetchData={fetchData}
                searchable
                noDataMessage={noDataMessage}
            >
                {data.items.map(item => (
                    <DataSegment.Item
                        key={item.id}
                        selected={item.isSelected}
                        className={`${item.id} deploymentSegment`}
                        onClick={() => onSelectDeployment(item)}
                    >
                        <DeploymentDetails
                            customName={
                                <div>
                                    <LastExecutionStatusIcon
                                        execution={item.lastExecution}
                                        onShowLogs={() => onShowLogs(item.id, item.lastExecution.id)}
                                        onShowUpdateDetails={onShowUpdateDetails}
                                        onActOnExecution={onActOnExecution}
                                        showLabel={showExecutionStatusLabel}
                                    />
                                    {showExecutionStatusLabel && <Divider hidden />}
                                    <Header
                                        as="h3"
                                        textAlign="center"
                                        style={showExecutionStatusLabel ? {} : { marginTop: 5 }}
                                    >
                                        <span className="breakWord">{item.id}</span>
                                    </Header>
                                </div>
                            }
                            customActions={<MenuAction item={item} onSelectAction={onMenuAction} />}
                            deployment={item}
                            instancesCount={item.nodeInstancesCount}
                            instancesStates={item.nodeInstancesStates}
                            onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                        />

                        <ExecutionProgress
                            execution={item.lastExecution}
                            instancesCount={item.nodeInstancesCount}
                            instancesStates={item.nodeInstancesStates}
                        />
                    </DataSegment.Item>
                ))}
            </DataSegment>
        );
    }
}
