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

    _updateLoading(comp) {
        if (comp) {
            if (this.props.loading) {
                $(comp).find('form').addClass('loading');
            } else  {
                $(comp).find('form').removeClass('loading');
            }
        }
    }

    render () {
        return (
            <div className="content" ref={this._updateLoading.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

