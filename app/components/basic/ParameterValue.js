/**
 * Created by jakubniezgoda on 24/10/2018.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { CopyToClipboardButton, HighlightText } from './index';
import StageUtils from '../../utils/stageUtils';

/**
 * ParameterValue is a component which shows parameters (e.g. deployment/blueprint inputs, outputs, runtime properties, ...)
 * in nice user-friendly formatted manner with copy to clipboard button.
 *
 * ## Access
 * `Stage.Basic.ParameterValue`
 *
 * ## Usage
 * ```
 * <ParameterValue value={value} />
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
     *
     * @property {any} [value=''] parameter value (original type)
     * @property {bool} [showCopyButton=true] if set to true, then CopyToClipboardButton will be shown
     */
    static propTypes = {
        value: PropTypes.any,
        showCopyButton: PropTypes.bool
    };

    static defaultProps = {
        value: '',
        showCopyButton: true
    };

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props, nextProps);
    }

    getValueElement(stringValue) {
        const { Url, Json } = StageUtils;

        const commonStyle = { padding: '0.5em', whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
        const typedValue = this.props.value;

        switch (Json.toType(typedValue)) {
            case 'array':
            case 'object':
                return <HighlightText className="json">{stringValue}</HighlightText>;
            case 'boolean':
                return (
                    <code style={commonStyle} className="hljs-keyword">
                        {stringValue}
                    </code>
                );
            case 'number':
                return (
                    <code style={commonStyle} className="hljs-number">
                        {stringValue}
                    </code>
                );
            case 'null':
                return (
                    <code style={commonStyle} className="hljs-keyword">
                        {stringValue}
                    </code>
                );
            case 'string':
                return Url.isUrl(stringValue) ? (
                    <a target="_blank" href={stringValue}>
                        {stringValue}
                    </a>
                ) : (
                    <code style={commonStyle} className="hljs-string">
                        {stringValue}
                    </code>
                );
            default:
                return (
                    <code style={commonStyle} className="hljs-literal">
                        {stringValue}
                    </code>
                );
        }
    }

    render() {
        const { Json } = StageUtils;

        const stringValue = _.isObject(this.props.value)
            ? Json.stringify(this.props.value, true)
            : Json.getStringValue(this.props.value);

        return this.props.showCopyButton ? (
            <div>
                <CopyToClipboardButton text={stringValue} className="rightFloated" />
                {this.getValueElement(stringValue)}
            </div>
        ) : (
            this.getValueElement(stringValue)
        );
    }
}
