/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'

export default class Header extends Component {
    static propTypes = {
        onWidgetsGridEditModeChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired
    };


    toggleEditMode() {
        this.props.onWidgetsGridEditModeChange(!this.props.isEditMode);
    }

    render() {
        return (
            <div className="ui top fixed menu teal inverted secondary">
                <div className="logo">
                    <img src="/app/images/Cloudify-logo.png"></img>
                </div>
                <div className="right menu">
                    <div className="ui dropdown item" ref={dropdown=>$(dropdown).dropdown()}>
                        <i className="circular user icon"></i>
                        <i className="dropdown icon"></i>
                        <div className="menu">
                            <div className="item"><i className="settings icon"></i> Configure</div>
                            <div className="item" onClick={this.toggleEditMode.bind(this)}>
                                <i className="configure icon"></i>
                                {this.props.isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
                            </div>
                            <div className="item"><i className="shutdown icon"></i> Logout</div>
                        </div>
                    </div>
                    {/*<i className="inverted configure link icon large" onClick={this.toggleEditMode.bind(this)}/>*/}
                </div>
           </div>

        );
    }
}