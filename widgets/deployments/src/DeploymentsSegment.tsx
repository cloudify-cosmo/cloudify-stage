import styled from 'styled-components';
import type { FullDeploymentData } from 'app/widgets/common/deployments/DeploymentActions';
import ActionsMenus from './ActionsMenus';
import ExecutionProgress from './ExecutionProgress';
import type { DeploymentViewProps } from './types';

const DeploymentName = styled.span`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const DeploymentIdAndName = styled.span`
    display: inline-flex;
    align-items: center;
`;

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
}: DeploymentViewProps) {
    const { DataSegment, Divider, Header } = Stage.Basic;
    const { IdPopup } = Stage.Shared;
    const DeploymentDetails = Stage.Common.Deployments.Details;
    const { LatestExecutionStatusIcon } = Stage.Common.Executions;
    const formatName = (item: Pick<FullDeploymentData, 'id' | 'display_name'>) =>
        Stage.Utils.formatDisplayName({ id: item.id, displayName: item.display_name });

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
                                <LatestExecutionStatusIcon
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
                                    <DeploymentIdAndName>
                                        <DeploymentName title={formatName(item)} aria-label="Deployment name">
                                            {item.display_name}
                                        </DeploymentName>
                                        <IdPopup selected={false} id={item.id} />
                                    </DeploymentIdAndName>
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

                    {item.lastExecution && <ExecutionProgress execution={item.lastExecution} />}
                </DataSegment.Item>
            ))}
        </DataSegment>
    );
}
