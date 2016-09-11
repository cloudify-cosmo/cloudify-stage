/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import SideBar from './SideBar';
import Page from '../containers/Page';

export default class Home extends Component {
    render() {

        return (
            <div className='main'>
                <SideBar pageId={this.props.params.pageId}/>

                <div className="page">
                    <div className="ui basic segment">
                        <Page pageId={this.props.params.pageId}/>
                    </div>
                </div>
            </div>
        );
    }
}

