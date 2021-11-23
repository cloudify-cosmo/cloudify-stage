// @ts-nocheck File not migrated fully to TS
/**
 * Created by kinneretzin on 29/08/2016.
 */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HeaderBar, MenusBar } from 'cloudify-ui-components';

import i18n from 'i18next';
import Users from '../../containers/Users';
import Banner from '../banner/Banner';
import ResetPagesModal from '../ResetPagesModal';
import Consts from '../../utils/consts';

export default class Header extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showConfigureModal: false,
            showResetPagesConfirm: false
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
        const { manager, onResetPages } = this.props;
        const { showResetPagesConfirm } = this.state;

        return (
            <HeaderBar>
                <Banner />

                <MenusBar>
                    <Users
                        manager={manager}
                        showAllOptions={!this.isModeCustomer()}
                        onReset={() => this.setState({ showResetPagesConfirm: true })}
                    />
                </MenusBar>

                <ResetPagesModal
                    open={showResetPagesConfirm}
                    tenantNames={manager.tenants.items.map(tenant => tenant.name)}
                    onConfirm={tenantList => {
                        this.setState({ showResetPagesConfirm: false });
                        onResetPages(tenantList);
                    }}
                    onHide={() => this.setState({ showResetPagesConfirm: false })}
                />
            </HeaderBar>
        );
    }
}

Header.propTypes = {
    manager: PropTypes.shape({
        tenants: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })) })
    }).isRequired,
    mode: PropTypes.string.isRequired,
    onResetPages: PropTypes.func.isRequired
};
