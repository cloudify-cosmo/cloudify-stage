/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import Pages from '../containers/Pages';

export default class SideBar extends Component {
    static propTypes = {
        homePageId: PropTypes.string.isRequired,
        pageId: PropTypes.string.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        isOpen: PropTypes.bool.isRequired
    };
    
    render() {
        let isOpen = this.props.isOpen ? 'open' : '';
        let isEditSideBar = this.props.isEditMode ? 'editSideBar' : '';

        return (
            <div className='sidebarContainer'>
                <div className={`ui visible left vertical sidebar menu small basic ${isEditSideBar} ${isOpen}`}>
                    <Pages pageId={this.props.pageId} isEditMode={this.props.isEditMode} homePageId={this.props.homePageId}/>
                </div>
                {
                    this.props.isEditMode &&
                    <div className={`ui center aligned basic segment addPageContainer ${isOpen}`}>
                        <AddPageButton/>
                    </div>
                }
            </div>
        );
    }
}
