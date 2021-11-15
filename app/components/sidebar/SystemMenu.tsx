import type { FunctionComponent } from 'react';
import React from 'react';
import TenantSelection from './TenantSelection';

interface SystemMenuProps {
    expanded: boolean;
}

const SystemMenu: FunctionComponent<SystemMenuProps> = ({ expanded }) => {
    return (
        <>
            <TenantSelection expanded={expanded} />
        </>
    );
};

export default SystemMenu;
