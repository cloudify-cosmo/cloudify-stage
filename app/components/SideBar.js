/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddPageButton from '../containers/AddPageButton';
import Pages from '../containers/Pages';

export default class SideBar extends Component {
    static propTypes = {
        pageId: PropTypes.string.isRequired
    }

    render() {
        return (
        <div className="ui visible left vertical sidebar menu small">
                <div className="ui center aligned basic segment">
                    <AddPageButton/>
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
