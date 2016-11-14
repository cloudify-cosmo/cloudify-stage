'use strict';
/**
 * Created by kinneretzin on 8/23/15.
 */

import React, { Component, PropTypes } from 'react';

export default class ModalBody extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        loading: PropTypes.bool
    };

    componentDidUpdate() {
        if (this.props.loading) {
            $(this.refs.content).find('form').addClass('loading');
        } else  {
            $(this.refs.content).find('form').removeClass('loading');
        }
    }

    render () {
        return (
            <div className="content" ref="content">
                {this.props.children}
            </div>
        );
    }
}

