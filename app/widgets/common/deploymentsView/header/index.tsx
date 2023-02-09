import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import i18n from 'i18next';
import { Button, Dropdown } from '../../../../components/basic';
import { i18nPrefix } from '../common';
import FilterModal from './filter/FilterModal';
import RunWorkflowModal from './RunWorkflowModal';
import DeployOnModal from './DeployOnModal';
import type { FilterRule } from '../../filters/types';
import { useFilterIdFromUrl } from './common';
import { useBoolean } from '../../../../utils/hooks';
import type { DeployOnModalProps } from './DeployOnModal';

interface DeploymentsViewHeaderProps extends Pick<DeployOnModalProps, 'selectedDeployment'> {
    filterRules: FilterRule[];
    mapOpen: boolean;
    toggleMap: () => void;
    onFilterChange: (filterRules?: FilterRule[]) => void;
    toolbox: Stage.Types.Toolbox;
    disableBulkActions: boolean;
}

const tHeader = (suffix: string) => i18n.t(`${i18nPrefix}.header.${suffix}`);
const tMap = (suffix: string) => tHeader(`map.${suffix}`);

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({
    mapOpen,
    toggleMap,
    onFilterChange,
    toolbox,
    filterRules,
    disableBulkActions,
    selectedDeployment
}) => {
    const [filterModalOpen, openFilterModal, closeFilterModal] = useBoolean();
    const [deployOnModalOpen, openDeployOnModal, closeDeployOnModal] = useBoolean();
    const [runWorkflowModalOpen, openRunWorkflowModal, closeRunWorkflowModal] = useBoolean();
    const [userFilterSelected, setUserFilterSelected] = useState<boolean>(false);
    const [userFilterId, setUserFilterId] = useState<string>();

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
                title={tMap(mapOpen ? 'closeMap' : 'openMap')}
                content={tMap('label')}
            />
            {userFilterSelected ? (
                <Button.Group color="blue">
                    <Button
                        icon="filter"
                        labelPosition="left"
                        content={userFilterId ?? tHeader('filter.unsavedFilter')}
                        onClick={openFilterModal}
                        style={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}
                    />
                    <Button
                        icon="delete"
                        onClick={() => handleFilterChange(undefined, undefined)}
                        title={tHeader('filter.clearButton')}
                    />
                </Button.Group>
            ) : (
                <Button
                    icon="filter"
                    labelPosition="left"
                    content={tHeader('filter.button')}
                    onClick={openFilterModal}
                    style={{ marginRight: 0 }}
                />
            )}
            <Dropdown
                button
                text={tHeader('bulkActions.button')}
                style={{ marginLeft: '0.25em' }}
                disabled={disableBulkActions}
            >
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu style={{ zIndex: 1000 }}>
                    <Item text={tHeader('bulkActions.deployOn.title')} onClick={openDeployOnModal} />
                    <Item text={tHeader('bulkActions.runWorkflow.title')} onClick={openRunWorkflowModal} />
                </Menu>
            </Dropdown>

            <FilterModal
                open={filterModalOpen}
                onCancel={closeFilterModal}
                onSubmit={handleFilterChange}
                toolbox={toolbox}
            />

            {deployOnModalOpen && (
                <DeployOnModal
                    filterRules={filterRules}
                    onHide={closeDeployOnModal}
                    toolbox={toolbox}
                    selectedDeployment={selectedDeployment}
                />
            )}

            {runWorkflowModalOpen && (
                <RunWorkflowModal filterRules={filterRules} onHide={closeRunWorkflowModal} toolbox={toolbox} />
            )}
        </>
    );
};
export default DeploymentsViewHeader;
