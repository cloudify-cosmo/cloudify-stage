import React, { FunctionComponent, useContext } from 'react';

import styled, { ThemeContext } from 'styled-components';
import { useSelector } from 'react-redux';
import PagesList from './PagesList';
import { Sidebar } from '../basic';
import { ReduxState } from '../../reducers';

const ThemedSidebar = styled(Sidebar)`
    background-color: ${props => props.theme.sidebarColor} !important;
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
}

const SideBar: FunctionComponent<SideBarProps> = ({ pageId }) => {
    const theme = useContext(ThemeContext) || {};
    const homePageId = useSelector((state: ReduxState) => state.pages[0].id);
    const isEditMode = useSelector((state: ReduxState) => state.config.isEditMode || false);
    const isOpen = useSelector((state: ReduxState) => state.app.sidebarIsOpen || false);
    const className = isOpen ? 'open' : '';

    return (
        <div className="sidebarContainer">
            <ThemedSidebar theme={theme} visible className={`vertical menu small basic ${className}`}>
                <PagesList pageId={pageId || homePageId} isEditMode={isEditMode} />
            </ThemedSidebar>
        </div>
    );
};

export default SideBar;
