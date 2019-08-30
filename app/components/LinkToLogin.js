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
        return this.props.portalUrl ? (
            <a href={this.props.portalUrl}>Back to apps</a>
        ) : (
            <Link to={{ pathname: Consts.LOGIN_PAGE_PATH, search: this.props.searchQuery }}>Back to login</Link>
        );
    }
}
