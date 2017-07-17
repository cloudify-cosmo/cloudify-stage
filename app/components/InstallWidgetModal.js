/**
 * Created by pposel on 11/04/2017.
 */

import React, { Component, PropTypes } from 'react';
import {Icon, Button, Divider, Form, Modal, Message} from "./basic/index"
import EventBus from '../utils/EventBus';

export default class InstallWidgetModal extends Component {

    constructor(props,context){
        super(props, context);

        this.state = InstallWidgetModal.initialState;
    }

    static initialState = {
        open: false,
        loading: false,
        widgetUrl: "",
        errors: {},
        scriptError: ""
    }

    static propTypes = {
        trigger: PropTypes.object.isRequired,
        header: PropTypes.string.isRequired,
        buttonLabel: PropTypes.string.isRequired,
        onWidgetInstalled: PropTypes.func.isRequired
    };

    static defaultProps = {
        onWidgetInstalled: ()=>Promise.resolve()
    };

    _installWidget() {
        let widgetFile = this.refs.widgetFile.file();

        let errors = {};

        if (_.isEmpty(this.state.widgetUrl) && !widgetFile) {
            errors["widgetUrl"]="Please select widget file or url";
        }

        if (!_.isEmpty(this.state.widgetUrl) && widgetFile) {
            errors["widgetUrl"]="Either widget file or url must be selected, not both";
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors, scriptError: ""});
            return false;
        }

        this.setState({loading: true, errors: {}, scriptError: ""});

        EventBus.on('window:error', this._showScriptError, this);
        this.props.onWidgetInstalled(widgetFile, this.state.widgetUrl)
            .then(()=>{
                EventBus.off('window:error', this._showScriptError);
                this.setState({loading: false, open: false});
            })
            .catch((err)=>{
                EventBus.off('window:error', this._showScriptError);
                this.setState({errors: {error: err.message}, loading: false});
            });
    }

    _openModal() {
        this.setState({...InstallWidgetModal.initialState, open: true});
    }

    _closeModal() {
        this.setState({open: false});
    }

    _showScriptError(message, source, lineno, colno) {
        this.setState({scriptError: `${message} (${source}:${lineno}:${colno})`});
    }

    _handleInputChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    render() {
        return (
            <Modal trigger={this.props.trigger} dimmer="blurring" open={this.state.open} className="installWidgetModal"
                   onOpen={this._openModal.bind(this)} onClose={this._closeModal.bind(this)}>
                <Modal.Header><Icon name="puzzle"/> {this.props.header}</Modal.Header>
                <Modal.Content>
                    <Form errors={this.state.errors} ref="installForm" loading={this.state.loading}>
                        <Form.Group>
                            <Form.Field width="9" error={this.state.errors.widgetUrl}>
                                <Form.Input label="URL" placeholder="Enter widget url" name="widgetUrl"
                                            value={this.state.widgetUrl} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>
                            <Form.Field width="1" style={{position:'relative'}}>
                                <Divider vertical>Or</Divider>
                            </Form.Field>
                            <Form.Field width="8" error={this.state.errors.widgetUrl}>
                                <Form.File placeholder="Select widget file" name="widgetFile" ref="widgetFile"/>
                            </Form.Field>
                        </Form.Group>
                    </Form>

                    {this.state.scriptError && <Message error>{this.state.scriptError}</Message>}
                </Modal.Content>
                <Modal.Actions>
                    <Button icon='remove' basic content='Cancel' onClick={this._closeModal.bind(this)}/>
                    <Button icon='puzzle' content={this.props.buttonLabel} color="green" onClick={this._installWidget.bind(this)} />
                </Modal.Actions>
            </Modal>
        );
    }
}
