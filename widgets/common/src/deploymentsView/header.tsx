import type { FunctionComponent } from 'react';
import { i18nPrefix } from './common';

interface DeploymentsViewHeaderProps {
    mapOpen: boolean;
    toggleMap: () => void;
}

const mapT = (suffix: string) => Stage.i18n.t(`${i18nPrefix}.header.map.${suffix}`);

const production = process.env.NODE_ENV === 'production' && !process.env.TEST;

const DeploymentsViewHeader: FunctionComponent<DeploymentsViewHeaderProps> = ({ mapOpen, toggleMap }) => {
    const { Button, Icon } = Stage.Basic;

    // TODO(RD-1225): enable the map in production
    if (production) {
        return null;
    }

    return (
        <Button active={mapOpen} onClick={toggleMap} title={mapT(mapOpen ? 'closeMap' : 'openMap')}>
            <Icon name="map" /> {mapT('label')}
        </Button>
    );
};
export default DeploymentsViewHeader;
