import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import TenantSelection from './TenantSelection';
import HelpMenu from './HelpMenu';
import HealthIndicator from './HealthIndicator';
import { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';

interface SystemMenuProps {
    onAboutModalOpen: () => void;
}

const SystemMenu: FunctionComponent<SystemMenuProps> = ({ onAboutModalOpen }) => {
    const mode = useSelector((state: ReduxState) => state.config.mode);

    return (
        <>
            <TenantSelection />
            <HelpMenu onAboutModalOpen={onAboutModalOpen} />
            {mode !== Consts.MODE_CUSTOMER && <HealthIndicator />}
        </>
    );
};

export default SystemMenu;
