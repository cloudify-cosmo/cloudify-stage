import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { i18nPrefix } from '../common';
import FilterModal from './FilterModal';
import RunWorkflowModal from './RunWorkflowModal';
import DeployOnModal from './DeployOnModal';
import { FilterRule } from '../../filters/types';

interface DeploymentsViewHeaderProps {
    filterRules: FilterRule[];
    mapOpen: boolean;
    toggleMap: () => void;
    onFilterChange: (filterRules?: FilterRule[]) => void;
    toolbox: Stage.Types.Toolbox;
}

const headerT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.${suffix}`);
const mapT = (suffix: string) => headerT(`map.${suffix}`);

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({
    mapOpen,
    toggleMap,
    onFilterChange,
    toolbox,
    filterRules
}) => {
    const { useBoolean } = Stage.Hooks;
    const [filterModalOpen, openFilterModal, closeFilterModal] = useBoolean();
    const [deployOnModalOpen, openDeployOnModal, closeDeployOnModal] = useBoolean();
    const [runWorkflowModalOpen, openRunWorkflowModal, closeRunWorkflowModal] = useBoolean();
    const [userFilterRules, setUserFilterRules] = useState<FilterRule[]>();
    const [userFilterId, setUserFilterId] = useState<string>();

    const { Button, Dropdown } = Stage.Basic;
    // @ts-ignore Properties does not exist on type 'typeof Dropdown'
    const { Menu, Item } = Dropdown;

    function handleFilterChange(newFilterRules?: FilterRule[], newFilterId?: string) {
        setUserFilterRules(newFilterRules);
        setUserFilterId(newFilterId);
        onFilterChange(newFilterRules);
        closeFilterModal();
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
            {userFilterRules ? (
                <Button.Group color="blue">
                    <Button
                        icon="filter"
                        labelPosition="left"
                        content={userFilterId ?? headerT('filter.unsavedFilter')}
                        onClick={openFilterModal}
                        style={{ whiteSpace: 'nowrap', maxWidth: 200, textOverflow: 'ellipsis', overflow: 'hidden' }}
                    />
                    <Button icon="delete" onClick={() => handleFilterChange()} title={headerT('filter.clearButton')} />
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
                {/* Display the menu above all leaflet components, see https://leafletjs.com/reference-1.7.1.html#map-pane */}
                <Menu style={{ zIndex: 1000 }}>
                    <Item text={headerT('bulkActions.deployOn.title')} onClick={openDeployOnModal} />
                    <Item text={headerT('bulkActions.runWorkflow.title')} onClick={openRunWorkflowModal} />
                </Menu>
            </Dropdown>

            <FilterModal
                filterRules={userFilterRules}
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
