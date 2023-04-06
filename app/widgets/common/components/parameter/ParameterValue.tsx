import React from 'react';
import type { CSSProperties } from 'react';
import { isObject } from 'lodash';
import { types } from 'cloudify-ui-common-frontend';
import highlighterStyles from 'react-syntax-highlighter/dist/esm/styles/hljs/idea';
import { CopyToClipboardButton, HighlightText } from '../../../../components/basic';
import Url from '../../../../utils/shared/UrlUtils';
import Json from '../../../../utils/shared/JsonUtils';

const getValueElement = (value: ParameterValueProps['value'], stringValue: string) => {
    const commonStyle = {
        display: 'inline-block',
        padding: '0.5em',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    } as CSSProperties;

    switch (types.toType(value)) {
        case 'array':
        case 'object':
            return <HighlightText>{stringValue}</HighlightText>;
        case 'number':
            return <code style={{ ...commonStyle, ...highlighterStyles['hljs-number'] }}>{stringValue}</code>;
        case 'boolean':
        case 'null':
            return <code style={{ ...commonStyle, ...highlighterStyles['hljs-keyword'] }}>{stringValue}</code>;
        case 'string':
            return Url.isUrl(stringValue) ? (
                <a rel="noopener noreferrer" target="_blank" href={stringValue} style={{ wordBreak: 'break-word' }}>
                    {stringValue}
                </a>
            ) : (
                <code style={{ ...commonStyle, ...highlighterStyles['hljs-string'] }}>{stringValue}</code>
            );
        default:
            return <code style={{ ...commonStyle, ...highlighterStyles['hljs-literal'] }}>{stringValue}</code>;
    }
};

export interface ParameterValueProps {
    /**
     * @property [value=''] parameter value (original type)
     * @default ''
     */
    value: any;

    /**
     * @property if set to true, then CopyToClipboardButton will be shown
     * @default true
     */
    showCopyButton?: boolean;
}

/**
 * ParameterValue is a component which shows parameter (e.g. deployment/blueprint inputs, outputs, runtime properties, ...)
 * in nice user-friendly formatted manner with copy to clipboard button.
 */
const ParameterValue = ({ value = '', showCopyButton = true }: ParameterValueProps) => {
    const stringValue = isObject(value) ? Json.stringify(value, true) : Json.getStringValue(value);

    return showCopyButton ? (
        <div>
            <CopyToClipboardButton text={stringValue} className="rightFloated" />
            {getValueElement(value, stringValue)}
        </div>
    ) : (
        getValueElement(value, stringValue)
    );
};

export default ParameterValue;
