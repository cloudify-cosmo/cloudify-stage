/**
 * Created by jakubniezgoda on 24/10/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * ParameterValue is a component which shows parameters (e.g. deployment/blueprint inputs, outputs, runtime properties, ...)
 * in nice user-friendly formatted manner with copy to clipboard button.
 *
 * ## Access
 * `Stage.Basic.ParameterValue`
 *
 * ## Usage
 * ```
 * <ParameterValue value={value}>
 * ```
 *
 * ### ParameterValue for JSON
 * ![ParameterValue JSON](manual/asset/ParameterValue_0.png)
 *
 * ### ParameterValue for string
 * ![ParameterValue STRING](manual/asset/ParameterValue_1.png)
 *
 */
export default class ParameterValue extends Component {

    /**
     * propTypes
     * @property {any} [value=''] parameter value
     */
    static propTypes = {
        value: PropTypes.any
    };

    static defaultProps = {
        value: ''
    };

    render() {
        let {CopyToClipboardButton, HighlightText} = Stage.Basic;
        let {JsonUtils} = Stage.Common;
        let {isUrl} = Stage.Utils;

        const value = this.props.value;
        const stringValue = _.isObject(value) ? JsonUtils.stringify(value, true) : JsonUtils.getStringValue(value);

        return (
            <div>
                <CopyToClipboardButton text={stringValue} className='rightFloated' />
                {
                    _.isObject(value)
                    ?
                        <HighlightText>{stringValue}</HighlightText>
                    :
                            _.isString(value) && isUrl(stringValue)
                            ?
                                <a target="_blank" href={stringValue}>{stringValue}</a>
                            :
                                <code style={{padding: '0.5em'}}>{stringValue}</code>
                }
            </div>
        );
    }
}