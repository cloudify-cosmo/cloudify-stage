import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import TenantSelection from './TenantSelection';
import HelpMenu from './HelpMenu';
import HealthIndicator from './HealthIndicator';
import { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';
import UserMenu from './UserMenu';

export interface SystemMenuGroupItemProps {
    onModalOpen: () => void;
    expanded: boolean;
    onGroupClick: () => void;
}

export enum SystemMenuGroup {
    HelpMenuGroup,
    UserMenuGroup
}

const groupComponents = {
    [SystemMenuGroup.HelpMenuGroup]: HelpMenu,
    [SystemMenuGroup.UserMenuGroup]: UserMenu
};

interface SystemMenuProps {
    onModalOpen: () => void;
    expandedGroup?: SystemMenuGroup;
    onGroupClick: (group: SystemMenuGroup) => void;
}

const SystemMenu: FunctionComponent<SystemMenuProps> = ({ expandedGroup, onModalOpen, onGroupClick }) => {
    const mode = useSelector((state: ReduxState) => state.config.mode);

    function renderGroupItem(group: SystemMenuGroup) {
        const GroupComponent = groupComponents[group];
        return (
            <GroupComponent
                expanded={expandedGroup === group}
                onModalOpen={onModalOpen}
                onGroupClick={() => onGroupClick(group)}
            />
        );
    }

    return (
        <>
            <TenantSelection />
            {renderGroupItem(SystemMenuGroup.HelpMenuGroup)}
            {mode !== Consts.MODE_CUSTOMER && <HealthIndicator />}
            {renderGroupItem(SystemMenuGroup.UserMenuGroup)}
        </>
    );
};

export default SystemMenu;
