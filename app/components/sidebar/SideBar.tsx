import React, { FunctionComponent, useContext } from 'react';

import styled, { ThemeContext } from 'styled-components';
import { useSelector } from 'react-redux';
import PagesList from './PagesList';
import { Sidebar } from '../basic';
import { ReduxState } from '../../reducers';
import SystemMenu from './SystemMenu';
import { useBoolean } from '../../utils/hooks';

const ThemedSidebar = styled(Sidebar)`
    &&& {
        background-color: ${props => props.theme.sidebarColor} !important;
        display: flex;
        overflow-y: visible !important;
        ${props => (!props.expanded && `width: ${props.width} !important;`) || ''}
    }
    .item {
        color: ${props => props.theme.sidebarTextColor} !important;
    }
    .item.active,
    .item:hover {
        background-color: ${props => props.theme.sidebarHoverActiveColor} !important;
        color: ${props => props.theme.sidebarTextColor} !important;
    }
`;

interface SideBarProps {
    pageId: string;
    width: number;
}

const SideBar: FunctionComponent<SideBarProps> = ({ pageId, width }) => {
    const theme = useContext(ThemeContext) || {};
    const homePageId = useSelector((state: ReduxState) => state.pages[0].id);
    const isEditMode = useSelector((state: ReduxState) => state.config.isEditMode || false);

    const [expanded, expand, collapse] = useBoolean();

    return (
        <div className="sidebarContainer">
            <ThemedSidebar
                theme={theme}
                visible
                className="vertical menu small open"
                expanded={expanded || isEditMode}
                onMouseEnter={expand}
                onMouseLeave={collapse}
                width={width}
            >
                <PagesList pageId={pageId || homePageId} isEditMode={isEditMode} expanded={expanded || isEditMode} />
                {!isEditMode && <SystemMenu />}
            </ThemedSidebar>
        </div>
    );
};

export default SideBar;
