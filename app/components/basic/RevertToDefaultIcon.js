/**
 * Created by jakub.niezgoda on 14/09/2018.
 */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Icon, Popup } from './index';


/**
 * RevertToDefaultIcon is a component showing undo icon. It is desired to be used in input fields.
 *
 * ## Access
 * `Stage.Basic.RevertToDefaultIcon`
 *
 * ## Usage
 * ![RevertToDefaultIcon](manual/asset/RevertToDefaultIcon_0.png)
 *
 * ```
 * <Form.Input icon={<RevertToDefaultIcon value={this.state.value} defaultValue={param.default}
 *             onClick={() => this.revertToDefault(param.name)} />} value={this.state.value} />
 * ```
 */
export default class RevertToDefaultIcon extends Component {

    /**
     * propTypes
     * @property {any} value typed field value
     * @property {any} defaultValue typed field default value
     * @property {function} onClick function to be called on revert icon click
     */
    static propTypes = {
        value: PropTypes.any,
        defaultValue: PropTypes.any,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        // value can be null/undefined
        // defaultValue can be null/undefined
        onClick: _.noop
    };

    render() {
        let {Icon, Popup} = Stage.Basic;

        return !_.isNil(this.props.defaultValue) && !_.isEqual(this.props.value, this.props.defaultValue)
            ?
            <Popup trigger={<Icon name='undo' link onClick={this.props.onClick} />}>
                Revert to default value
            </Popup>
            : null;
    }
}