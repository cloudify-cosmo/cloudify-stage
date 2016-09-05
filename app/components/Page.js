/**
 * Created by kinneretzin on 29/08/2016.
 */

import React, { Component, PropTypes } from 'react';

import SideBar from './SideBar';
import Dashboard from './Dashboard';

export default class Page extends Component {
    render() {

        return (
            <div className='main'>
                <SideBar/>

                <div className="pusher">
                    <div className="ui basic segment">
                        <Dashboard/>
                    </div>
                </div>
            </div>
        );
    }
}

