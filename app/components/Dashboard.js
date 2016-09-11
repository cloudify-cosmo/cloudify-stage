/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';

import AddWidget from '../containers/AddWidget';
import Widgets from '../containers/Widgets';

export default class Dashboard extends Component {

    render() {
        return (
            <div className="">
                <h3 className='ui header dividing'>
                    My Page
                </h3>
                <AddWidget/>

                <Widgets/>

            </div>
        );
    }
}
