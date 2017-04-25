/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import Pages from '../containers/Pages';

export default class SideBar extends Component {
    static propTypes = {
        pageId: PropTypes.string.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };

    render() {
        return (
            <div>
                <div className={`ui visible left vertical sidebar menu small basic ${this.props.isEditMode?'editSideBar':''}`}>
                    <Pages pageId={this.props.pageId} isEditMode={this.props.isEditMode}/>
                </div>
                {
                    this.props.isEditMode &&
                    <div className="ui center aligned basic segment addPageContainer">
                        <AddPageButton/>
                    </div>
                }
            </div>
        );
    }
}
