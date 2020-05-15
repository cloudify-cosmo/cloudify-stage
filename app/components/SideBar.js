/**
 * Created by kinneretzin on 29/08/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';

import Pages from '../containers/Pages';

export default class SideBar extends Component {
    static propTypes = {
        homePageId: PropTypes.string.isRequired,
        pageId: PropTypes.string.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        isOpen: PropTypes.bool
    };

    render() {
        const { homePageId, isEditMode, pageId } = this.props;
        const isOpen = isOpen ? 'open' : '';

        return (
            <div className="sidebarContainer">
                <div className={`ui visible left vertical sidebar menu small basic  ${isOpen}`}>
                    <Pages pageId={pageId} isEditMode={isEditMode} homePageId={homePageId} />
                </div>
            </div>
        );
    }
}
