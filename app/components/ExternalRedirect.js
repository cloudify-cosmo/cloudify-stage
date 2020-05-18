/**
 * Created by jakubniezgoda on 23/04/2018.
 */

import React, { Component } from 'react';

export class ExternalRedirect extends Component {
    componentDidMount() {
        const { url } = this.props;
        window.location = url;
    }

    render() {
        const { url } = this.props;
        return <section>Redirecting to {url}...</section>;
    }
}
