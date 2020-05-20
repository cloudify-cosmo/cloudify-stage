import { types } from 'cloudify-ui-common';

/**
 * ParameterValue is a component which shows parameters (e.g. deployment/blueprint inputs, outputs, runtime properties, ...)
 * in nice user-friendly formatted manner with copy to clipboard button.
 */
export default class ParameterValue extends React.Component {
    /**
     * propTypes
     *
     * @property {any} [value=''] parameter value (original type)
     * @property {boolean} [showCopyButton=true] if set to true, then CopyToClipboardButton will be shown
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
        const { HighlightText } = Stage.Basic;
        const { Url } = Stage.Utils;

        const commonStyle = { padding: '0.5em', whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
        const { value: typedValue } = this.props;

        switch (types.toType(typedValue)) {
            case 'array':
            case 'object':
                return <HighlightText language="json">{stringValue}</HighlightText>;
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

Stage.defineCommon({
    name: 'ParameterValue',
    common: ParameterValue
});
