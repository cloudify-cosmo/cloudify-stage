/**
 * Created by kinneretzin on 29/08/2016.
 */


import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import Tenants from '../../containers/Tenants';
import Manager from '../../containers/Manager';
import Consts from '../../utils/consts';

export default class Header extends Component {
    static propTypes = {
        onWidgetsGridEditModeChange: PropTypes.func.isRequired,
        isEditMode: PropTypes.bool.isRequired,
        manager: PropTypes.any.isRequired,
        mode: PropTypes.string.isRequired,
        onLogout: PropTypes.func.isRequired
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
                    {
                        this.props.mode === Consts.MODE_MAIN &&
                        <div className='item managerAndTenants'>
                            <Manager manager={this.props.manager}/>
                            <Tenants manager={this.props.manager}/>
                        </div>
                    }
                    <div className="ui dropdown inline item" ref={dropdown=>$(dropdown).dropdown()}>
                        <i className="circular user icon"></i>
                        <i className="dropdown icon"></i>

                        {
                            this.props.mode === Consts.MODE_MAIN ?
                                <div className="menu">
                                    <div className="item"><i className="settings icon"></i> Configure</div>
                                    <div className="item" onClick={this.toggleEditMode.bind(this)}>
                                        <i className="configure icon"></i>
                                        {this.props.isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}
                                    </div>
                                </div>
                            :
                                <div className="menu">
                                    <div className="item" onClick={this.props.onLogout}><i className="power icon" ></i> Logout</div>
                                </div>
                        }
                    </div>
                    {/*<i className="inverted configure link icon large" onClick={this.toggleEditMode.bind(this)}/>*/}
                </div>
            </div>

        );
    }
}