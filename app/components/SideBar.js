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
    }

    render() {
        var elements = [];
        if (this.props.isEditMode) {
            elements.push(<AddPageButton/>);
        }
        return (
        <div className="ui visible left vertical sidebar menu small inverted">
            <div className="ui center aligned basic segment">
            {elements}
            </div>
            {/*
                <div className='ui item'>
                    <h5 className="ui header olive"> <div className="sub header">Pages </div></h5>
                </div>
                */}
                <Pages pageId={this.props.pageId}/>
            </div>
        );
    }
}
