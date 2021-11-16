import type { FunctionComponent } from 'react';
import React from 'react';
import TenantSelection from './TenantSelection';
import Help from './Help';

const SystemMenu: FunctionComponent = () => {
    return (
        <>
            <Help />
            <TenantSelection />
        </>
    );
};

export default SystemMenu;
