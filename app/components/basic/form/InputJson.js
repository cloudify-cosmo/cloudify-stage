/**
 * Created by jakubniezgoda on 11/04/2019.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import ReactJsonView from 'react-json-view';
import { TextArea } from 'semantic-ui-react';

import { Icon, Label, List, Popup } from '../index';

/**
 * InputJson is a component TODO...
 *
 * ## Access
 * `Stage.Basic.Form.Json`
 *
 * ## Usage
 * ![InputJson](manual/asset/form/InputJson_0.png)
 *
 * ```
 * <Form.Json TODO />
 * ```
 *
 */
export default class InputJson extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            isRawView: false,
            isParsableToJson: true,
            isMouseOver: false
        };

        this.onChangeJson = this.onChangeJson.bind(this);
        this.onChangeString = this.onChangeString.bind(this);
        this.switchView = this.switchView.bind(this);
    }

    /**
     * propTypes
     * @property {string} name name of the field
     * @property {object} [value=null] TODO
     * @property {function} [onChange=(function () {});] TODO
     */
    static propTypes = {
        name: PropTypes.string.isRequired,
        value: PropTypes.any,
        onChange: PropTypes.func,
    };

    static defaultProps = {
        value: {},
        onChange: _.noop,
    };

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props)
            || !_.isEqual(nextState, this.state);
    }

    componentDidMount() {
        if (!_.isObject(this.props.value)) {
            this.setIsParsableToJson(this.props.value);
        }
    }

    onChangeJson(changeObject) {
        this.props.onChange(null, {
            name: this.props.name,
            value: changeObject.updated_src
        });
    }

    setIsParsableToJson(value) {
        let isParsableToJson = true;

        try {
            JSON.parse(value);
        } catch (error) {
            isParsableToJson = false;
        }

        this.setState({ isParsableToJson });
    }

    onChangeString(event, {name, value}) {
        let valueToSave;

        try {
            valueToSave = JSON.parse(value);
        } catch (error) {
            valueToSave = value;
        }

        this.props.onChange(null, { name, value: valueToSave });
        this.setIsParsableToJson(value);
    }

    switchView() {
        this.setState({isRawView: !this.state.isRawView});
    }

    getStringValue() {
        const value = this.props.value;
        let result = '';

        if (_.isObject(value)) {
            try {
                result = JSON.stringify(value, null, 4);
            } catch (error) {
                result = '';
            }
        } else {
            result = String(value);
        }

        return result;
    }

    getJsonValue() {
        const value = this.props.value;
        let result = '';

        if (_.isObject(value)) {
            result = value;
        } else {
            try {
                result = JSON.parse(value);
            } catch (error) {
                result = {};
            }
        }

        return result;
    }

    render() {
        const stringValue = this.getStringValue();
        const jsonValue = this.getJsonValue();


        return (
            <div style={{position: 'relative'}} onMouseEnter={() => this.setState({isMouseOver: true})}
                 onMouseLeave={() => this.setState({isMouseOver: false})}>
                {
                    this.state.isRawView
                    ?
                        <TextArea name={this.props.name} value={stringValue} onChange={this.onChangeString} />
                    :
                        <div style={{border: '1px solid rgba(34,36,38,.15)', borderRadius: 4, padding: 10}}>
                            <ReactJsonView src={jsonValue} name={null} enableClipboard={false} defaultValue={''}
                                           onAdd={this.onChangeJson} onEdit={this.onChangeJson} onDelete={this.onChangeJson}
                            />
                        </div>
                }
                {
                    this.state.isMouseOver &&
                        <Popup>
                            <Popup.Trigger>
                                <Icon name='edit' link={this.state.isParsableToJson} disabled={!this.state.isParsableToJson}
                                      style={{position: 'absolute', top: 10, right: 30}}
                                      onClick={this.state.isParsableToJson ? this.switchView : _.noop} />
                            </Popup.Trigger>
                            <Popup.Content>
                                {
                                    this.state.isParsableToJson
                                    ? `Switch to ${this.state.isRawView ? 'Rich View' : 'Text View'}`
                                    : 'Cannot switch to Rich View. Text cannot be parsed to JSON.'
                                }
                            </Popup.Content>
                        </Popup>
                }
                {
                    this.state.isMouseOver && !this.state.isRawView &&
                    <Popup wide='very'>
                        <Popup.Trigger>
                            <Icon name='info' style={{position: 'absolute', top: 10, right: 50, cursor: 'pointer'}} />
                        </Popup.Trigger>
                        <Popup.Content>
                            <List>
                                <List.Item><Label>Ctrl + Click</Label> to enter edit mode</List.Item>
                                <List.Item>In edit mode <Label>Ctrl + Enter</Label> to submit changes</List.Item>
                                <List.Item>In edit mode <Label>Escape</Label> to cancel changes</List.Item>
                            </List>
                        </Popup.Content>
                    </Popup>
                }

            </div>
        );
    }
}
