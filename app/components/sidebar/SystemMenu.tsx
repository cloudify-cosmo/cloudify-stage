import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import TenantSelection from './TenantSelection';
import HelpMenu from './HelpMenu';
import HealthIndicator from './HealthIndicator';
import { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';
import UserMenu from './UserMenu';

interface SystemMenuProps {
    onModalOpen: () => void;
}

const SystemMenu: FunctionComponent<SystemMenuProps> = ({ onModalOpen }) => {
    const mode = useSelector((state: ReduxState) => state.config.mode);

    return (
        <>
            <TenantSelection />
            <HelpMenu onAboutModalOpen={onModalOpen} />
            {mode !== Consts.MODE_CUSTOMER && <HealthIndicator />}
            <UserMenu onModalOpen={onModalOpen} />
        </>
    );
};

export default SystemMenu;
