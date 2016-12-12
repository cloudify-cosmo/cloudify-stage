/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class Search extends Component {

    render() {
        return (
            <div className="ui input">
                <label><input type="search" placeholder="Search"/></label>
            </div>
        );
    }
}
 