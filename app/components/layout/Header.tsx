// @ts-nocheck File not migrated fully to TS

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HeaderBar } from 'cloudify-ui-components';

import i18n from 'i18next';
import Banner from '../banner/Banner';

export default class Header extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        document.title = i18n.t('pageTitle');
    }

    render() {
        return (
            <HeaderBar>
                <Banner />
            </HeaderBar>
        );
    }
}

Header.propTypes = {
    manager: PropTypes.shape({
        tenants: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired })) })
    }).isRequired
};
