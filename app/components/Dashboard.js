/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import InlineEdit from 'react-edit-inline';

import AddWidget from '../containers/AddWidget';
import Widgets from '../containers/Widgets';



export default class Dashboard extends Component {
    constructor(props){
      super(props);
      this.dataChanged = this.dataChanged.bind(this);
      this.state = {
        name: 'Demo Page'
      }
    }

    dataChanged(data) {
        this.setState({...data})
    }

    render() {

            return (
            <div className="">
                <h3 className='ui header dividing'>
                <InlineEdit
              text={this.state.name}
                change={this.dataChanged}
                paramName="name"
                />
                </h3>
                <AddWidget/>

                <Widgets/>

            </div>
        );
    }
}
