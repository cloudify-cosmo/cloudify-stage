/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Managers from '../../containers/Managers.js';

export default class Header extends Component {
    static propTypes = {
        onWidgetsGridEditModeChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        managers: PropTypes.any.isRequired
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
                    <Managers managers={this.props.managers}/>
                    <div className="ui dropdown inline item" ref={dropdown=>$(dropdown).dropdown()}>
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