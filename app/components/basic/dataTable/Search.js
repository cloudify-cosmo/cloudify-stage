/**
 * Created by pawelposel on 17/11/2016.
 */
  
import React, { Component, PropTypes } from 'react';

export default class Search extends Component {

    render() {
        return (
            <div className="field">
                <div className="ui icon input">
                    <input type="text" placeholder="Search..."/>
                        <i className="search icon"/>
                </div>
            </div>
        );
    }
}
 