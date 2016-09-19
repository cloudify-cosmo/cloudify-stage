/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

export default class Header extends Component {
    static isEditMode = false;
    static propTypes = {
        onWidgetsGridEditModeChange: PropTypes.func.isRequired
    };


    componentDidMount () {
        if (this.isEditMode == null)
        {
            this.isEditMode = false;
        }
    }
    //$('.grid-stack').on('enable');

    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        this.props.onWidgetsGridEditModeChange(this.isEditMode);
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