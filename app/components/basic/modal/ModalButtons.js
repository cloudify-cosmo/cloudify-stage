'use strict';

import React, { Component, PropTypes } from 'react';
import { Button } from 'semantic-ui-react';

export class ApproveButton extends Component {

    static propTypes = {
        content: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        content: 'Save',
        icon: 'checkmark',
        className: 'ok'
    };

    render () {
        return (
            <Button {...this.props} />
        );
    }
}

export class CancelButton extends Component {

    static propTypes = {
        content: PropTypes.string,
        icon: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        content: 'Cancel',
        icon: 'remove',
        className: 'basic cancel'
    };

    render () {
        return (
            <Button {...this.props} />
        );
    }
}