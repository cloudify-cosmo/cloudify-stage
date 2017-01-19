/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import SideBar from '../containers/SideBar';
import Page from '../containers/Page';

export default class Home extends Component {

    render() {
        var pageId = this.props.params.pageId || "0";

        return (
            <div className='main'>
                <SideBar pageId={pageId}/>

                <div className="page">
                    <div className="ui basic segment">
                        <Page pageId={pageId} pageName={this.props.params.pageName}/>
                    </div>
                </div>
            </div>
        );
    }
}

