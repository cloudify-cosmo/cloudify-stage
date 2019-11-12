/**
 * Created by jakubniezgoda on 11/04/2019.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import ReactJsonView from 'react-json-view';
import { TextArea } from 'semantic-ui-react';

import { Icon, Label, List, Popup } from '../index';

class ReactJsonViewWrapper extends Component {
    static propTypes = {
        value: PropTypes.object,
        divStyle: PropTypes.object,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: {},
        divStyle: {},
        onChange: _.noop
    };

    shouldComponentUpdate(nextProps) {
        return !_.isEqual(nextProps, this.props);
    }

    render() {
        return (
            <div style={this.props.divStyle}>
                <ReactJsonView
                    src={this.props.value}
                    name={null}
                    enableClipboard={false}
                    defaultValue=""
                    onAdd={this.props.onChange}
                    onEdit={this.props.onChange}
                    onDelete={this.props.onChange}
                />
            </div>
        );
    }
}

/**
 * InputJson is a component providing text or rich editor for JSON-like data
 *
 * ## Access
 * `Stage.Basic.Form.Json`
 *
 * ## Usage
 * ![InputJson](manual/asset/form/InputJson_0.png)
 *
 * ```
 * <Form.Json name='port_conf' value={'{"webserver_port2":6,"webserver_port1":5}'} />
 * ```
 *
 */
export default class InputJson extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            isRawView: true,
            isParsableToJson: false,
            isMouseOver: false
        };

        this.onChangeJson = this.onChangeJson.bind(this);
        this.onChangeString = this.onChangeString.bind(this);
        this.switchView = this.switchView.bind(this);
    }

    /**
     * propTypes
     *
     * @property {string} name name of the field
     * @property {any} [value="{}"] value of the field
     * @property {boolean} [error=false] is field invalid
     * @property {Function} [onChange=(function () {});] function to be called on value change
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
        error: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        value: '{}',
        error: false,
        onChange: _.noop
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
    }

    componentDidMount() {
        const isParsableToJson = this.isParsableToJson();
        this.setState({ isParsableToJson, isRawView: !isParsableToJson });
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(this.props.value, prevProps.value)) {
            const isParsableToJson = this.isParsableToJson();
            this.setState({
                isParsableToJson,
                isRawView: !this.state.isRawView ? !isParsableToJson : this.state.isRawView
            });
        }
    }

    // See: https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
    isParsableToJson() {
        const { value } = this.props;
        let isParsableToJson = true;

        if (!_.isString(value)) {
            isParsableToJson = false;
        } else {
            try {
                const result = JSON.parse(value);
                isParsableToJson =
                    Object.prototype.toString.call(result) === '[object Object]' || Array.isArray(result);
            } catch (err) {
                isParsableToJson = false;
            }
        }

        return isParsableToJson;
    }

    onChangeJson(changeObject) {
        const { Json } = Stage.Utils;

        this.props.onChange(null, {
            name: this.props.name,
            value: Json.getStringValue(changeObject.updated_src)
        });
    }

    onChangeString(event, { name, value }) {
        this.props.onChange(event, { name, value });
    }

    switchView() {
        this.setState({ isRawView: !this.state.isRawView });
    }

    render() {
        const { Json } = Stage.Utils;

        const { value } = this.props;
        const stringValue = Json.getStringValue(value);
        const jsonValue = Json.getTypedValue(value);

        const divStyle = {
            backgroundColor: this.props.error ? '#fff6f6' : '',
            border: `1px solid ${this.props.error ? 'rgb(224, 180, 180)' : 'rgba(34,36,38,.15)'}`,
            borderRadius: 4,
            padding: 10
        };

        return (
            <div
                style={{ position: 'relative' }}
                onMouseEnter={() => this.setState({ isMouseOver: true })}
                onMouseLeave={() => this.setState({ isMouseOver: false })}
            >
                {this.state.isRawView ? (
                    <TextArea name={this.props.name} value={stringValue} onChange={this.onChangeString} />
                ) : (
                    <ReactJsonViewWrapper value={jsonValue} divStyle={divStyle} onChange={this.onChangeJson} />
                )}
                {this.state.isMouseOver && (
                    <Popup>
                        <Popup.Trigger>
                            <Icon
                                name="edit"
                                link={this.state.isParsableToJson}
                                disabled={!this.state.isParsableToJson}
                                style={{ position: 'absolute', top: 10, right: 30 }}
                                onClick={this.state.isParsableToJson ? this.switchView : _.noop}
                            />
                        </Popup.Trigger>
                        <Popup.Content>
                            {this.state.isParsableToJson
                                ? `Switch to ${this.state.isRawView ? 'Rich View' : 'Text View'}`
                                : 'Cannot switch to Rich View. Text cannot be parsed to JSON.'}
                        </Popup.Content>
                    </Popup>
                )}
                {this.state.isMouseOver && !this.state.isRawView && (
                    <Popup wide="very">
                        <Popup.Trigger>
                            <Icon name="info" style={{ position: 'absolute', top: 10, right: 50, cursor: 'pointer' }} />
                        </Popup.Trigger>
                        <Popup.Content>
                            <List>
                                <List.Item>
                                    <Label>Ctrl + Click</Label> to enter edit mode
                                </List.Item>
                                <List.Item>
                                    In edit mode <Label>Ctrl + Enter</Label> to submit changes
                                </List.Item>
                                <List.Item>
                                    In edit mode <Label>Escape</Label> to cancel changes
                                </List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>
                )}
            </div>
        );
    }
}
