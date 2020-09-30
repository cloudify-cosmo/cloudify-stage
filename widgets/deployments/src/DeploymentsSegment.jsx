/**
 * Created by kinneretzin on 18/10/2016.
 */

import MenuAction from './MenuAction';
import DeploymentUpdatedIcon from './DeploymentUpdatedIcon';
import ExecutionProgress from './ExecutionProgress';
import DeploymentsViewPropTypes from './props/DeploymentsViewPropTypes';
import DeploymentsViewDefaultProps from './props/DeploymentsViewDefaultProps';

export default function DeploymentsSegment({
    allowedSettingTo,
    data,
    fetchData,
    noDataMessage,
    onActOnExecution,
    onMenuAction,
    onSelectDeployment,
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

DeploymentsSegment.propTypes = DeploymentsViewPropTypes;

DeploymentsSegment.defaultProps = DeploymentsViewDefaultProps;
