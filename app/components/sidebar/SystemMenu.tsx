import type { FunctionComponent } from 'react';
import React from 'react';
import TenantSelection from './TenantSelection';
import HelpMenu from './HelpMenu';

const SystemMenu: FunctionComponent = () => {
    return (
        <>
            <HelpMenu />
            <TenantSelection />
        </>
    );
};

export default SystemMenu;
