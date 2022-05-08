import type { FunctionComponent } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import TenantSelection from './TenantSelection';
import HelpMenu from './HelpMenu';
import HealthIndicator from './HealthIndicator';
import type { ReduxState } from '../../reducers';
import Consts from '../../utils/consts';
import UserMenu from './UserMenu';
import { SideBarItemWrapper } from './SideBarItem';

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
    className?: string;
}

const SystemMenu: FunctionComponent<SystemMenuProps> = ({ expandedGroup, onModalOpen, onGroupClick, className }) => {
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
        <span className={className}>
            <TenantSelection />
            {renderGroupItem(SystemMenuGroup.HelpMenuGroup)}
            {mode !== Consts.MODE_CUSTOMER && <HealthIndicator />}
            {renderGroupItem(SystemMenuGroup.UserMenuGroup)}
        </span>
    );
};

export default styled(SystemMenu)`
    & ${SideBarItemWrapper} {
        overflow: hidden;
    }
`;
