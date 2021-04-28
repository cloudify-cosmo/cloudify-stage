import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { i18nPrefix } from '../common';
import FilterModal from './FilterModal';
import ExecuteDeploymentModal from '../../ExecuteDeploymentModal';

interface DeploymentsViewHeaderProps {
    mapOpen: boolean;
    toggleMap: () => void;
    onFilterChange: (filterId: string | undefined) => void;
    toolbox: Stage.Types.Toolbox;
}

type Workflow = {
    name: string;
    parameters: Record<string, string>;
};

const headerT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.${suffix}`);
const mapT = (suffix: string) => headerT(`map.${suffix}`);

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({
    mapOpen,
    toggleMap,
    onFilterChange,
    toolbox
}) => {
    const { useBoolean } = Stage.Hooks;
    const [filterModalOpen, openFilterModal, closeFilterModal] = useBoolean();
    const [executeModalOpen, openExecuteModal, closeExecuteModal] = useBoolean();
    const [selectedWorkflow, selectWorkflow] = useState<Workflow | null>(null);
    const [filterId, setFilterId] = useState<string>();

    const { Button, Dropdown } = Stage.Basic;
    // @ts-ignore Properties does not exist on type 'typeof Dropdown'
    const { Menu, Item } = Dropdown;

    function handleFilterChange(newFilterId: string | undefined) {
        setFilterId(newFilterId);
        onFilterChange(newFilterId);
        closeFilterModal();
    }

    const workflowsResult = useQuery('filtered-workflows', () =>
        toolbox.getManager().doGet('/workflows', {
            _filter_id: filterId
        })
    );

    const workflowsMenu = (() => {
        if (workflowsResult.isLoading) {
            const { Loading } = Stage.Basic;

            return (
                <Item>
                    <Loading />
                </Item>
            );
        }

        if (workflowsResult.isError) {
            const { ErrorMessage } = Stage.Basic;

            return (
                <ErrorMessage header={mapT('errorLoadingSites')} error={workflowsResult.error as { message: string }} />
            );
        }

        if (workflowsResult.isIdle) {
            throw new Error('Idle state for fetching workflows data is not handled');
        }
        return workflowsResult.data.items.map((workflow: Workflow) => (
            <Item
                key={workflow.name}
                onClick={() => {
                    selectWorkflow(workflow);
                    openExecuteModal();
                }}
            >
                {workflow.name}
            </Item>
        ));
    })();

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
            <Dropdown button text={headerT('bulkActions.button')}>
                <Menu>
                    <Item text={headerT('bulkActions.menu.deployOn')} />
                    <Item>
                        <Dropdown text={headerT('bulkActions.menu.runWorkflow')} direction="left">
                            <Menu>{workflowsMenu}</Menu>
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

            {!_.isEmpty(selectedWorkflow) && (
                <ExecuteDeploymentModal
                    open={executeModalOpen}
                    workflow={selectedWorkflow}
                    onExecute={_.noop} // TODO
                    onHide={closeExecuteModal}
                    toolbox={toolbox}
                />
            )}
        </>
    );
};
export default DeploymentsViewHeader;
