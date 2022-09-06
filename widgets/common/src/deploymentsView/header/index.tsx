import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { i18nPrefix } from '../common';
import FilterModal from './filter/FilterModal';
import RunWorkflowModal from './RunWorkflowModal';
import DeployOnModal from './DeployOnModal';
import type { FilterRule } from '../../filters/types';
import { useFilterIdFromUrl } from './common';

interface DeploymentsViewHeaderProps {
    filterRules: FilterRule[];
    mapOpen: boolean;
    toggleMap: () => void;
    onFilterChange: (filterRules?: FilterRule[]) => void;
    toolbox: Stage.Types.Toolbox;
    disableBulkActions: boolean;
}

const headerT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.${suffix}`);
const mapT = (suffix: string) => headerT(`map.${suffix}`);

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({
    mapOpen,
    toggleMap,
    onFilterChange,
    toolbox,
    filterRules,
    disableBulkActions
}) => {
    const { useBoolean } = Stage.Hooks;
    const [filterModalOpen, openFilterModal, closeFilterModal] = useBoolean();
    const [deployOnModalOpen, openDeployOnModal, closeDeployOnModal] = useBoolean();
    const [runWorkflowModalOpen, openRunWorkflowModal, closeRunWorkflowModal] = useBoolean();
    const [userFilterSelected, setUserFilterSelected] = useState<boolean>(false);
    const [userFilterId, setUserFilterId] = useState<string>();

    const { Button, Dropdown } = Stage.Basic;
    const { Menu, Item } = Dropdown;

    const [filterIdFromUrl, , deleteFilterIdInUrl] = useFilterIdFromUrl();

    function handleFilterChange(newFilterRules: FilterRule[] | undefined, newFilterId: string | undefined) {
        setUserFilterSelected(!!newFilterRules);
        setUserFilterId(newFilterId);
        onFilterChange(newFilterRules);
        closeFilterModal();
        if (filterIdFromUrl && filterIdFromUrl !== newFilterId) {
            deleteFilterIdInUrl();
        }
    }

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
            {userFilterSelected ? (
                <Button.Group color="blue">
                    <Button
                        icon="filter"
                        labelPosition="left"
                        content={userFilterId ?? headerT('filter.unsavedFilter')}
                        onClick={openFilterModal}
                        style={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}
                    />
                    <Button
                        icon="delete"
                        onClick={() => handleFilterChange(undefined, undefined)}
                        title={headerT('filter.clearButton')}
                    />
                </Button.Group>
            ) : (
                <Button
                    icon="filter"
                    labelPosition="left"
                    content={headerT('filter.button')}
                    onClick={openFilterModal}
                    style={{ marginRight: 0 }}
                />
            )}
            <Dropdown
                button
                text={headerT('bulkActions.button')}
                style={{ marginLeft: '0.25em' }}
                disabled={disableBulkActions}
            >
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu style={{ zIndex: 1000 }}>
                    <Item text={headerT('bulkActions.deployOn.title')} onClick={openDeployOnModal} />
                    <Item text={headerT('bulkActions.runWorkflow.title')} onClick={openRunWorkflowModal} />
                </Menu>
            </Dropdown>

            <FilterModal
                open={filterModalOpen}
                onCancel={closeFilterModal}
                onSubmit={handleFilterChange}
                toolbox={toolbox}
            />

            {deployOnModalOpen && (
                <DeployOnModal filterRules={filterRules} onHide={closeDeployOnModal} toolbox={toolbox} />
            )}

            {runWorkflowModalOpen && (
                <RunWorkflowModal filterRules={filterRules} onHide={closeRunWorkflowModal} toolbox={toolbox} />
            )}
        </>
    );
};
export default DeploymentsViewHeader;
