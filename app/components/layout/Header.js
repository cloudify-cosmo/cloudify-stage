/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

export default class Header extends Component {
    static isEditMode = false;
    static propTypes = {
        onWidgetsGridEditModeChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };


    toggleEditMode() {
        this.props.onWidgetsGridEditModeChange(!this.props.isEditMode);
    }

    render() {
        return (
            <div className="ui top fixed menu teal inverted">
                <div className="logo">
                    <img src="/app/images/Cloudify-logo.png"></img>
                </div>
                <div className="editmode">
                    <i className="inverted configure link icon large" onClick={this.toggleEditMode.bind(this)}/>
                </div>
           </div>

        );
    }
}