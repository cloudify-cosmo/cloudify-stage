/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';
import React from 'react';

import Pages from '../containers/Pages';

export default function SideBar({ homePageId, isEditMode, isOpen, pageId }) {
    const className = isOpen ? 'open' : '';

    return (
        <div className="sidebarContainer">
            <div className={`ui visible left vertical sidebar menu small basic ${className}`}>
                <Pages pageId={pageId} isEditMode={isEditMode} homePageId={homePageId} />
            </div>
        </div>
    );
}

SideBar.propTypes = {
    homePageId: PropTypes.string.isRequired,
    pageId: PropTypes.string.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isOpen: PropTypes.bool.isRequired
};
