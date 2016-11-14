'use strict';

import React, { Component, PropTypes } from 'react';

export default class ModalFooter extends Component {

    static propTypes = {
        children: PropTypes.any.isRequired,
        loading: PropTypes.bool
    };

    componentDidUpdate() {
        if (this.props.loading) {
            $(this.refs.actions).find('.button').attr('disabled','disabled').addClass('disabled loading');
        } else  {
            $(this.refs.actions).find('.button').removeAttr('disabled').removeClass('disabled loading');
        }
    }

    render () {
        return (
            <div className="actions" ref="actions">
                {this.props.children}
            </div>
        );
    }
}

