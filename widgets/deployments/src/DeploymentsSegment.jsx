import ExecutionProgress from './ExecutionProgress';
import DeploymentsViewPropTypes from './props/DeploymentsViewPropTypes';
import DeploymentsViewDefaultProps from './props/DeploymentsViewDefaultProps';

export default function DeploymentsSegment({
    data,
    fetchData,
    noDataMessage,
    onActOnExecution,
    onMenuAction,
    onSelectDeployment,
    onWorkflowAction,
    onSetVisibility,
    showExecutionStatusLabel,
    toolbox,
    widget
}) {
    const { DataSegment, Divider, Header } = Stage.Basic;
    const { DeploymentActionsMenu, DeploymentDetails, LastExecutionStatusIcon, WorkflowsMenu } = Stage.Common;

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
                                    onActOnExecution={onActOnExecution}
                                    showLabel={showExecutionStatusLabel}
                                    toolbox={toolbox}
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
                        customActions={
                            <div className="menuAction">
                                <WorkflowsMenu
                                    workflows={item.workflows}
                                    popupMenuProps={{ icon: 'cogs' }}
                                    onClick={workflow => onWorkflowAction(item.id, workflow.name)}
                                />
                                <DeploymentActionsMenu
                                    onActionClick={actionName => onMenuAction(item.id, actionName)}
                                    toolbox={toolbox}
                                />
                            </div>
                        }
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

DeploymentsSegment.propTypes = DeploymentsViewPropTypes;

DeploymentsSegment.defaultProps = DeploymentsViewDefaultProps;
