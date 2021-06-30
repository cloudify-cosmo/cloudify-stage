// @ts-nocheck File not migrated fully to TS
import ActionsMenus from './ActionsMenus';
import ExecutionProgress from './ExecutionProgress';
import DeploymentsViewPropTypes from './props/DeploymentsViewPropTypes';
import DeploymentsViewDefaultProps from './props/DeploymentsViewDefaultProps';

export default function DeploymentsSegment({
    data,
    fetchData,
    noDataMessage,
    onActOnExecution,
    onDeploymentAction,
    onSelectDeployment,
    onWorkflowAction,
    onSetVisibility,
    showExecutionStatusLabel,
    toolbox,
    widget
}) {
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
                                <ActionsMenus
                                    deployment={item}
                                    onDeploymentAction={onDeploymentAction}
                                    onWorkflowAction={onWorkflowAction}
                                    workflows={item.workflows}
                                    toolbox={toolbox}
                                />
                            </div>
                        }
                        deployment={item}
                        instancesCount={item.nodeInstancesCount}
                        instancesStates={item.nodeInstancesStates}
                        onSetVisibility={visibility => onSetVisibility(item.id, visibility)}
                    />

                    <ExecutionProgress execution={item.lastExecution} />
                </DataSegment.Item>
            ))}
        </DataSegment>
    );
}

DeploymentsSegment.propTypes = DeploymentsViewPropTypes;

DeploymentsSegment.defaultProps = DeploymentsViewDefaultProps;
