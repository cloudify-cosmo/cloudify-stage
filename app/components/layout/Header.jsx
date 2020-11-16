/**
 * Created by kinneretzin on 29/08/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import i18n from 'i18next';
import Tenants from '../../containers/Tenants';
import Manager from '../../containers/Manager';
import Users from '../../containers/Users';
import Help from '../../containers/Help';
import Banner from '../../containers/banner/Banner';
import AboutModal from '../../containers/AboutModal';
import ResetPagesModal from '../ResetPagesModal';
import { Icon } from '../basic';
import Consts from '../../utils/consts';

export default class Header extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showConfigureModal: false,
            showResetPagesConfirm: false,
            showAboutModal: false
        };
    }

    componentDidMount() {
        document.title = i18n.t('pageTitle');
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { manager } = this.props;
        return !_.isEqual(manager, nextProps.manager) || !_.isEqual(this.state, nextState);
    }

    isModeMain() {
        const { mode } = this.props;
        return mode === Consts.MODE_MAIN;
    }

    isModeCustomer() {
        const { mode } = this.props;
        return mode === Consts.MODE_CUSTOMER;
    }

    render() {
        const { manager, onResetPages, onSidebarOpen } = this.props;
        const { showAboutModal, showResetPagesConfirm } = this.state;

        return (
            <div className="ui top fixed menu inverted secondary headerBar">
                <Icon
                    link
                    name="content"
                    className="sidebar-button show-on-small-screen"
                    size="large"
                    onClick={onSidebarOpen}
                />
                <Banner />

                <div className="right menu">
                    {!this.isModeCustomer() && (
                        <div className="item" style={{ margin: 0, padding: 0 }}>
                            <Manager />
                        </div>
                    )}
                    {this.isModeMain() && <Tenants manager={manager} />}
                    <Help onAbout={() => this.setState({ showAboutModal: true })} />

                    <Users
                        manager={manager}
                        showAllOptions={!this.isModeCustomer()}
                        onReset={() => this.setState({ showResetPagesConfirm: true })}
                    />
                </div>

                <ResetPagesModal
                    open={showResetPagesConfirm}
                    tenants={manager.tenants}
                    onConfirm={tenantList => {
                        this.setState({ showResetPagesConfirm: false });
                        onResetPages(tenantList);
                    }}
                    onHide={() => this.setState({ showResetPagesConfirm: false })}
                />

                <AboutModal open={showAboutModal} onHide={() => this.setState({ showAboutModal: false })} />
            </div>
        );
    }
}

Header.propTypes = {
    manager: PropTypes.shape({ tenants: PropTypes.shape({}) }).isRequired,
    mode: PropTypes.string.isRequired,
    onResetPages: PropTypes.func.isRequired,
    onSidebarOpen: PropTypes.func.isRequired
};
