import type { FunctionComponent } from 'react';
import React from 'react';
import TenantSelection from './TenantSelection';
import HelpMenu from './HelpMenu';

interface SystemMenuProps {
    onAboutModalOpen: () => void;
}

const SystemMenu: FunctionComponent<SystemMenuProps> = ({ onAboutModalOpen }) => {
    return (
        <>
            <HelpMenu onAboutModalOpen={onAboutModalOpen} />
            <TenantSelection />
        </>
    );
};

export default SystemMenu;
