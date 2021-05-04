import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useQuery, QueryObserverResult } from 'react-query';
import { i18nPrefix } from '../common';
import FilterModal from './FilterModal';
import ExecuteDeploymentModal from '../../ExecuteDeploymentModal';
import WorkflowsMenu from '../../WorkflowsMenu';

interface DeploymentsViewHeaderProps {
    mapOpen: boolean;
    toggleMap: () => void;
    onFilterChange: (filterId: string | undefined) => void;
    toolbox: Stage.Types.Toolbox;
}

type Workflow = {
    name: string;
    parameters: Record<string, string>;
    plugin: string;
};

type WorkflowsResponse = Stage.Types.PaginatedResponse<Workflow>;

const headerT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.${suffix}`);
const mapT = (suffix: string) => headerT(`map.${suffix}`);

function getWorkflowMenuItems(
    workflowsResult: QueryObserverResult<WorkflowsResponse>,
    onClick: (workflow: Workflow) => void
) {
    const { Dropdown, Loading, Message } = Stage.Basic;
    // @ts-ignore Properties does not exist on type 'typeof Dropdown'
    const { Item, Menu } = Dropdown;

    if (workflowsResult.isLoading) {
        return <Item icon={<Loading message="" />} disabled />;
    }

    if (workflowsResult.isError || workflowsResult.isIdle) {
        if (workflowsResult.isError) {
            log.error(workflowsResult.error as { message: string });
        }

        return <Message error header={headerT('bulkActions.errors.workflowsFetchFailed')} />;
    }

    return <WorkflowsMenu workflows={workflowsResult.data.items} onClick={onClick} showInPopup={false} />;
}

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({
    mapOpen,
    toggleMap,
    onFilterChange,
    toolbox
}) => {
    const { useBoolean } = Stage.Hooks;
    const [filterModalOpen, openFilterModal, closeFilterModal] = useBoolean();
    const [executeModalOpen, openExecuteModal, closeExecuteModal] = useBoolean();
    const [selectedWorkflow, selectWorkflow] = useState<Workflow | undefined>();
    const [filterId, setFilterId] = useState<string>();

    const { Button, Dropdown } = Stage.Basic;
    // @ts-ignore Properties does not exist on type 'typeof Dropdown'
    const { Menu, Item } = Dropdown;

    function handleFilterChange(newFilterId: string | undefined) {
        setFilterId(newFilterId);
        onFilterChange(newFilterId);
        closeFilterModal();
    }

    function startExecutionGroup(workflowParameters: Record<string, any>) {
        const deploymentGroupsActions = new Stage.Common.DeploymentGroupsActions(toolbox);
        const groupId = `BATCH_ACTION_${new Date().toISOString()}`;
        const workflowId = selectedWorkflow?.name;

        deploymentGroupsActions.doCreate(groupId, filterId!).then(_deploymentGroup => {
            const executionGroupsActions = new Stage.Common.ExecutionGroupsActions(toolbox);

            return executionGroupsActions.doStart(workflowId!, groupId, workflowParameters).then(_executionGroup => {
                toolbox.getEventBus().trigger('deployments:refresh');
                toolbox.getEventBus().trigger('executions:refresh');
            });
        });
    }

    const workflowsResult = useQuery<WorkflowsResponse>([filterId], () =>
        toolbox.getManager().doGet('/workflows', {
            _filter_id: filterId
        })
    );

    return (
        <>
            <Button
                labelPosition="left"
                icon="map"
                active={mapOpen}
                onClick={toggleMap}
                title={mapT(mapOpen ? 'closeMap' : 'openMap')}
                content={mapT('label')}
            />
            {filterId ? (
                <Button.Group color="blue">
                    <Button
                        icon="filter"
                        labelPosition="left"
                        content={filterId}
                        onClick={openFilterModal}
                        style={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}
                    />
                    <Button
                        icon="delete"
                        onClick={() => handleFilterChange(undefined)}
                        title={headerT('filter.clearButton')}
                    />
                </Button.Group>
            ) : (
                <Button
                    icon="filter"
                    labelPosition="left"
                    content={headerT('filter.button')}
                    onClick={openFilterModal}
                />
            )}
            <Dropdown button disabled={!filterId} text={headerT('bulkActions.button')}>
                <Menu>
                    <Item text={headerT('bulkActions.menu.deployOn')} />
                    <Item>
                        <Dropdown text={headerT('bulkActions.menu.runWorkflow')} direction="left" scrolling>
                            <Menu>
                                {getWorkflowMenuItems(workflowsResult, workflow => {
                                    selectWorkflow(workflow);
                                    openExecuteModal();
                                })}
                            </Menu>
                        </Dropdown>
                    </Item>
                </Menu>
            </Dropdown>

            <FilterModal
                filterId={filterId}
                open={filterModalOpen}
                onCancel={closeFilterModal}
                onSubmit={handleFilterChange}
                toolbox={toolbox}
            />

            {selectedWorkflow && (
                <ExecuteDeploymentModal
                    open={executeModalOpen}
                    workflow={selectedWorkflow}
                    onExecute={startExecutionGroup}
                    onHide={closeExecuteModal}
                    toolbox={toolbox}
                />
            )}
        </>
    );
};
export default DeploymentsViewHeader;
