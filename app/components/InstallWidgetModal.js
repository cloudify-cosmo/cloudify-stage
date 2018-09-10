/**
 * Created by pposel on 11/04/2017.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import {Icon, Button, Form, Label, Modal, Message} from './basic/index'
import EventBus from '../utils/EventBus';

export default class InstallWidgetModal extends Component {

    constructor(props,context){
        super(props, context);

        this.widgetFileRef = React.createRef();

        this.state = InstallWidgetModal.initialState;
    }

    static initialState = {
        open: false,
        loading: false,
        widgetUrl: '',
        widgetFile: '',
        errors: {},
        scriptError: ''
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

    componentWillUpdate(prevProps, prevState) {
        if (!prevProps.open && this.props.open) {
            this.widgetFileRef.current && this.widgetFileRef.current.reset();
            this.setState(InstallWidgetModal.initialState);
        }
    }

    _installWidget() {
        let widgetUrl = this.state.widgetFile ? '' : this.state.widgetUrl;

        let errors = {};

        if (!this.state.widgetFile) {
            if (_.isEmpty(widgetUrl)) {
                errors['widgetUrl'] = "Please provide the widget's archive URL or select a file";
            } else if (!Stage.Utils.isUrl(widgetUrl)) {
                errors['widgetUrl'] = "Please provide valid URL for widget's archive";
            }
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors, scriptError: ''});
            return false;
        }

        this.setState({loading: true, errors: {}, scriptError: ''});

        EventBus.on('window:error', this._showScriptError, this);
        this.props.onWidgetInstalled(this.state.widgetFile, widgetUrl)
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

    _onWidgetUrlFocus() {
        if (this.state.widgetFile) {
            this.widgetFileRef.current && this.widgetFileRef.current.reset();
            this._onWidgetFileReset();
        }
    }

    _onWidgetFileChange(file) {
        if (file) {
            this.setState({errors: {}, widgetUrl: file.name, widgetFile: file});
        }
    }

    _onWidgetFileReset() {
        this.setState({errors: {}, widgetUrl: '', widgetFile: null});
    }

    render() {
        return (
            <Modal trigger={this.props.trigger} dimmer="blurring" open={this.state.open} className="installWidgetModal"
                   onOpen={this._openModal.bind(this)} onClose={this._closeModal.bind(this)}>
                <Modal.Header><Icon name="puzzle"/> {this.props.header}</Modal.Header>
                <Modal.Content>
                    <Form errors={this.state.errors} ref="installForm" loading={this.state.loading}>
                        <Form.Field label='Widget package' required
                                    error={this.state.errors.widgetUrl}>
                            <Form.UrlOrFile name="widget" value={this.state.widgetUrl}
                                            placeholder="Provide the widget's archive URL or click browse to select a file"
                                            onChangeUrl={this._handleInputChange.bind(this)}
                                            onFocusUrl={this._onWidgetUrlFocus.bind(this)}
                                            onBlurUrl={() => {}}
                                            onChangeFile={this._onWidgetFileChange.bind(this)}
                                            onResetFile={this._onWidgetFileReset.bind(this)}
                                            label={<Label>{!this.state.widgetFile ? 'URL' : 'File'}</Label>}
                                            fileInputRef={this.widgetFileRef}
                            />
                        </Form.Field>
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
