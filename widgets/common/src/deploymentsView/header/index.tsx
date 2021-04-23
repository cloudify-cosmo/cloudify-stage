import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { i18nPrefix } from '../common';
import FilterModal from './FilterModal';

interface DeploymentsViewHeaderProps {
    mapOpen: boolean;
    toggleMap: () => void;
    onFilterChange: (filterId: string | undefined) => void;
    toolbox: Stage.Types.Toolbox;
}

const headerT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.${suffix}`);
const mapT = (suffix: string) => headerT(`map.${suffix}`);

const production = process.env.NODE_ENV === 'production' && !process.env.TEST;

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({
    mapOpen,
    toggleMap,
    onFilterChange,
    toolbox
}) => {
    const [filterModalOpen, openFilterModal, closeFilterModal] = Stage.Hooks.useBoolean();
    const [filterId, setFilterId] = useState<string>();

    const { Button } = Stage.Basic;

    function handleFilterChange(newFilterId: string | undefined) {
        setFilterId(newFilterId);
        onFilterChange(newFilterId);
        closeFilterModal();
    }

    return (
        <>
            {/* TODO(RD-1225): enable the map in production */}
            {!production && (
                <Button
                    labelPosition="left"
                    icon="map"
                    active={mapOpen}
                    onClick={toggleMap}
                    title={mapT(mapOpen ? 'closeMap' : 'openMap')}
                    content={mapT('label')}
                />
            )}
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

            <FilterModal
                filterId={filterId}
                open={filterModalOpen}
                onCancel={closeFilterModal}
                onSubmit={handleFilterChange}
                toolbox={toolbox}
            />
        </>
    );
};
export default DeploymentsViewHeader;
