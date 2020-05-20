/**
 * Created by edenp on 09/10/2017.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Consts from '../utils/consts';

export default class LinkToLogin extends Component {
    static propTypes = {
        portalUrl: PropTypes.string,
        searchQuery: PropTypes.string.isRequired
    };

    render() {
        const { portalUrl, searchQuery } = this.props;
        return portalUrl ? (
            <a href={portalUrl}>Back to apps</a>
        ) : (
            <Link to={{ pathname: Consts.LOGIN_PAGE_PATH, search: searchQuery }}>Back to login</Link>
        );
    }
}
