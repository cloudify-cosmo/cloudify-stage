// @ts-nocheck File not migrated fully to TS
import { types } from 'cloudify-ui-common';
import highlighterStyles from 'react-syntax-highlighter/dist/esm/styles/hljs/idea';

/**
 * ParameterValue is a component which shows parameters (e.g. deployment/blueprint inputs, outputs, runtime properties, ...)
 * in nice user-friendly formatted manner with copy to clipboard button.
 */
export default class ParameterValue extends React.Component {
    shouldComponentUpdate(nextProps) {
        return !_.isEqual(this.props, nextProps);
    }

    getValueElement(stringValue) {
        const { HighlightText } = Stage.Basic;
        const { Url } = Stage.Utils;

        const commonStyle = {
            display: 'inline-block',
            padding: '0.5em',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
        };
        const { value: typedValue } = this.props;

        switch (types.toType(typedValue)) {
            case 'array':
            case 'object':
                return <HighlightText language="json">{stringValue}</HighlightText>;
            case 'number':
                return <code style={{ ...commonStyle, ...highlighterStyles['hljs-number'] }}>{stringValue}</code>;
            case 'boolean':
            case 'null':
                return <code style={{ ...commonStyle, ...highlighterStyles['hljs-keyword'] }}>{stringValue}</code>;
            case 'string':
                return Url.isUrl(stringValue) ? (
                    <a rel="noopener noreferrer" target="_blank" href={stringValue}>
                        {stringValue}
                    </a>
                ) : (
                    <code style={{ ...commonStyle, ...highlighterStyles['hljs-string'] }}>{stringValue}</code>
                );
            default:
                return <code style={{ ...commonStyle, ...highlighterStyles['hljs-literal'] }}>{stringValue}</code>;
        }
    }

    render() {
        const { showCopyButton, value } = this.props;
        const { CopyToClipboardButton } = Stage.Basic;
        const { Json } = Stage.Utils;

        const stringValue = _.isObject(value) ? Json.stringify(value, true) : Json.getStringValue(value);

        return showCopyButton ? (
            <div>
                <CopyToClipboardButton text={stringValue} className="rightFloated" />
                {this.getValueElement(stringValue)}
            </div>
        ) : (
            this.getValueElement(stringValue)
        );
    }
}

/**
 * @property {any} [value=''] parameter value (original type)
 * @property {boolean} [showCopyButton=true] if set to true, then CopyToClipboardButton will be shown
 */
ParameterValue.propTypes = {
    value: Stage.PropTypes.AnyData,
    showCopyButton: PropTypes.bool
};

ParameterValue.defaultProps = {
    value: '',
    showCopyButton: true
};

declare global {
    namespace Stage.Common {
        export { ParameterValue };
    }
}

Stage.defineCommon({
    name: 'ParameterValue',
    common: ParameterValue
});
