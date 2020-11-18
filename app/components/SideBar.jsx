/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React, { useContext } from 'react';

import styled, { ThemeContext } from 'styled-components';
import Pages from '../containers/Pages';
import { Sidebar } from './basic';

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

export default function SideBar({ homePageId, isEditMode, isOpen, pageId }) {
    const className = isOpen ? 'open' : '';
    const theme = useContext(ThemeContext) || {};

    return (
        <div className="sidebarContainer">
            <ThemedSidebar theme={theme} visible className={`vertical menu small basic ${className}`}>
                <Pages pageId={pageId} isEditMode={isEditMode} homePageId={homePageId} />
            </ThemedSidebar>
        </div>
    );
}

SideBar.propTypes = {
    homePageId: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired
};
