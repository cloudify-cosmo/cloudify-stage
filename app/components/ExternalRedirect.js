/**
 * Created by jakubniezgoda on 23/04/2018.
 */

import React, { Component } from 'react';

export class ExternalRedirect extends Component {
    componentWillMount(){
        window.location = this.props.url;
    }
    render(){
        return (
            <section>Redirecting to {this.props.url}...</section>
        );
    }
}