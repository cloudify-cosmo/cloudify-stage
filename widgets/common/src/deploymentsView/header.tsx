import type { FunctionComponent } from 'react';
import { i18nPrefix } from './common';

interface DeploymentsViewHeaderProps {
    mapOpen: boolean;
    toggleMap: () => void;
}

const mapT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.map.${suffix}`);

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({ mapOpen, toggleMap }) => {
    const { Button, Icon } = Stage.Basic;

    return (
        <Button active={mapOpen} onClick={toggleMap} title={mapT(mapOpen ? 'closeMap' : 'openMap')}>
            <Icon name="map" /> {mapT('label')}
        </Button>
    );
};
export default DeploymentsViewHeader;
