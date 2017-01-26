'use strict';

import React, { Component, PropTypes } from 'react';

export default class ModalFooter extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        loading: PropTypes.bool
    };

    _updateLoading(comp) {
        if (comp) {
            if (this.props.loading) {
                $(comp).find('.button').attr('disabled','disabled').addClass('disabled');
            } else  {
                $(comp).find('.button').removeAttr('disabled').removeClass('disabled loading');
            }
        }
    }

    render () {
        return (
            <div className="actions" ref={this._updateLoading.bind(this)}>
                {this.props.children}
            </div>
        );
    }
}

