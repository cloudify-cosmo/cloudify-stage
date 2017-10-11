/**
 * Created by edenp on 09/10/2017.
 */
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class LinkToLogin extends Component {
    static propTypes = {
        portalUrl: PropTypes.string,
        searchQuery: PropTypes.string.isRequired
    };

    render () {
        return (
            this.props.portalUrl ?
                <a href={this.props.portalUrl}>Back to apps</a>
            :
                <Link to={{pathname: '/login', search: this.props.searchQuery}}>Back to login</Link>
        )
    }
}