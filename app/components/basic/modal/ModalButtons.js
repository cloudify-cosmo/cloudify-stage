'use strict';

import React, { Component, PropTypes } from 'react';
import { Button } from 'semantic-ui-react';

/**
 * ApproveButton is a component to present confirmation button in Modal component.
 *
 * ApproveButton is customized version of [Semantic UI-React's Button component](https://react.semantic-ui.com/elements/button),
 * so all properties of that component (eg. onClick, disabled, ...) can be used here.
 *
 * ## Access
 * `Stage.Basic.ApproveButton`
 *
 * ## Usage
 * ![ApproveButton](manual/asset/modals/ApproveButton_0.png)
 * ```
 * <ApproveButton content="Add" icon="add user" color="green"/>
 * ```
 */
export class ApproveButton extends Component {

    /**
     * propTypes
     * @property {string} [content='Save'] button content
     * @property {string} [icon='checkmark'] button icon
     * @property {string} [className='ok'] button classname
     */
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

/**
 * CancelButton is a component to present cancellation button in Modal component.
 *
 * CancelButton is customized version of [Semantic UI-React's Button component](https://react.semantic-ui.com/elements/button),
 * so all properties of that component (eg. onClick, disabled, ...) can be used here.
 *
 * ## Access
 * `Stage.Basic.CancelButton`
 *
 * ## Usage
 * ![CancelButton](manual/asset/modals/CancelButton_0.png)
 * ```
 * <CancelButton />
 * ```
 */
export class CancelButton extends Component {

    /**
     * propTypes
     * @property {string} [content='Cancel'] button content
     * @property {string} [icon='remove'] button icon
     * @property {string} [className='basic cancel'] button classname
     */
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