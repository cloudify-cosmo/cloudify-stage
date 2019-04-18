/**
 * Created by kinneretzin on 29/08/2016.
 */


import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Tenants from '../../containers/Tenants';
import Manager from '../../containers/Manager';
import Users from '../../containers/Users';
import Help from '../../containers/Help';
import Banner from '../../containers/banner/Banner';
import AboutModal from '../../containers/AboutModal';
import ResetPagesModal from '../ResetPagesModal.js';
import {Icon} from './../basic';
import Consts from '../../utils/consts';

export default class Header extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            showConfigureModal: false,
            showResetPagesConfirm: false,
            showAboutModal: false
        }
    }

    static propTypes = {
        manager: PropTypes.any.isRequired,
        mode: PropTypes.string.isRequired,
        pageTitle: PropTypes.string.isRequired,
        onResetPages: PropTypes.func.isRequired,
        onSidebarOpen : PropTypes.func.isRequired,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.manager, nextProps.manager)
            || !_.isEqual(this.state, nextState);
    }

    componentDidMount() {
        document.title = this.props.pageTitle;
    }

    _isModeMain() {
        return this.props.mode === Consts.MODE_MAIN;
    }

    _isModeCustomer() {
        return this.props.mode === Consts.MODE_CUSTOMER;
    }

    render() {

        return (
            <div className="ui top fixed menu inverted secondary headerBar">
                <Icon link name="content" className="sidebar-button show-on-small-screen" size="large"
                      onClick={this.props.onSidebarOpen} />
                <Banner />

                <div className="right menu">
                    {
                        !this._isModeCustomer() &&
                        <div className='item' style={{margin:0, padding: 0}}>
                            <Manager manager={this.props.manager}/>
                        </div>
                    }
                    {
                        this._isModeMain() &&
                        <Tenants manager={this.props.manager}/>
                    }
                    <Help onAbout={() => this.setState({showAboutModal: true})} />

                    <Users manager={this.props.manager}
                           showAllOptions={!this._isModeCustomer()}
                           onReset={() => this.setState({showResetPagesConfirm: true})} />
                </div>

                <ResetPagesModal open={this.state.showResetPagesConfirm}
                                 tenants={this.props.manager.tenants}
                                 onConfirm={(tenantList)=>{this.setState({showResetPagesConfirm: false}); this.props.onResetPages(tenantList)}}
                                 onHide={()=> this.setState({showResetPagesConfirm: false})} />

                <AboutModal open={this.state.showAboutModal}
                            onHide={()=> this.setState({showAboutModal: false})} />
            </div>
        );
    }
}