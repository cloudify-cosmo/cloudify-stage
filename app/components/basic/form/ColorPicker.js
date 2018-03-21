/**
 * Created by jakubniezgoda on 21/03/2018.
 */

import { CompactPicker } from 'react-color';
import React, { Component, PropTypes } from 'react';
const tinycolor = require('tinycolor2');

/**
 * ColorPicker is a component showing CompactPicker component from [react-color](https://casesandberg.github.io/react-color/) library
 *
 * ## Access
 * `Stage.Basic.Form.ColorPicker`
 *
 * ## Usage
 * ![ColorPicker](manual/asset/form/ColorPicker_0.png)
 *
 * ```
 * <ColorPicker />
 * ```
 *
 */
export default class ColorPicker extends Component {

    /**
     * propTypes
     * @property {string} [name=''] name of the color picker component
     * @property {string} [value='#000000'] hexadecimal color value
     * @property {function} [onChange=(function () {});] function called on color change
     */
    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func
    };

    static defaultProps = {
        name: '',
        value: '#000000',
        onChange: () => {}
    }

    _handleInputChange(color, event) {
        this.props.onChange(event, {
            name: this.props.name,
            value: color.hex
        })
    }
    render() {
        let color = tinycolor(this.props.value);

        return (
            <CompactPicker color={color.toHsl()} onChangeComplete={this._handleInputChange.bind(this)} />
        );
    }
}