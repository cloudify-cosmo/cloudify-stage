import React, { FunctionComponent, useContext, useState } from 'react';

import styled, { ThemeContext } from 'styled-components';
import { useSelector } from 'react-redux';
import { without } from 'lodash';
import PagesList from './PagesList';
import { Sidebar } from '../basic';
import { ReduxState } from '../../reducers';
import SystemMenu, { SystemMenuGroup } from './SystemMenu';
import { useBoolean, useResettableState } from '../../utils/hooks';
import SideBarHeader from './SideBarHeader';

export const collapsedSidebarWidth = '4.3rem';
export const expandedSidebarWidth = '17rem';

const ThemedSidebar = styled(Sidebar)`
    &&& {
        background-color: ${props => props.theme.sidebarColor} !important;
        display: flex;
        overflow-y: visible !important;
        width: ${props => (props.$expanded ? expandedSidebarWidth : collapsedSidebarWidth)} !important;
    }
    .item {
        color: ${props => props.theme.sidebarTextColor} !important;
        padding-left: ${props => !props.$expanded && '15px !important'};
    }
    .item.active,
    .item:hover {
        background-color: ${props => props.theme.sidebarHoverActiveColor} !important;
        color: ${props => props.theme.sidebarHoverActiveTextColor} !important;
    }
`;

interface SideBarProps {
    pageId: string;
}

const SideBar: FunctionComponent<SideBarProps> = ({ pageId }) => {
    const theme = useContext(ThemeContext) || {};
    const homePageId = useSelector((state: ReduxState) => state.pages[0].id);
    const isEditMode = useSelector((state: ReduxState) => state.config.isEditMode || false);

    const [expandedPageGroupIds, setExpandedPageGroupIds] = useState<string[]>([]);
    const [expandedSystemMenuGroup, setExpandedSystemMenuGroup, collapseExpandedSystemMenuGroup] = useResettableState<
        SystemMenuGroup | undefined
    >(undefined);

    const [expanded, expand, collapse] = useBoolean();

    function handlePageGroupExpand(pageGroupId: string) {
        if (isEditMode) setExpandedPageGroupIds([...expandedPageGroupIds, pageGroupId]);
        else setExpandedPageGroupIds([pageGroupId]);
        collapseExpandedSystemMenuGroup();
    }

    function handlePageGroupCollapse(pageGroupId: string) {
        setExpandedPageGroupIds(without(expandedPageGroupIds, pageGroupId));
    }

    function handleSystemMenuGroupClick(systemMenuGroup: SystemMenuGroup) {
        setExpandedSystemMenuGroup(expandedSystemMenuGroup === systemMenuGroup ? undefined : systemMenuGroup);
        setExpandedPageGroupIds([]);
    }

    return (
        <div className="sidebarContainer">
            <ThemedSidebar
                theme={theme}
                visible
                className="vertical menu small open"
                $expanded={expanded || isEditMode}
                onMouseEnter={expand}
                onMouseLeave={collapse}
            >
                <SideBarHeader />
                <PagesList
                    pageId={pageId || homePageId}
                    expandedGroupIds={expandedPageGroupIds}
                    onGroupCollapse={handlePageGroupCollapse}
                    onGroupExpand={handlePageGroupExpand}
                />
                {!isEditMode && (
                    <SystemMenu
                        onModalOpen={collapse}
                        expandedGroup={expandedSystemMenuGroup}
                        onGroupClick={handleSystemMenuGroupClick}
                    />
                )}
            </ThemedSidebar>
        </div>
    );
};

export default SideBar;
