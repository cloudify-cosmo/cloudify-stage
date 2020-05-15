/**
 * Created by pposel on 11/04/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon, Button, Form, Modal, Message } from './basic/index';
import EventBus from '../utils/EventBus';
import StageUtils from '../utils/stageUtils';

export default class InstallWidgetModal extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = InstallWidgetModal.initialState;
    }

    static initialState = {
        open: false,
        loading: false,
        widgetUrl: '',
        widgetFile: null,
        errors: {},
        scriptError: ''
    };

    static propTypes = {
        trigger: PropTypes.object.isRequired,
        header: PropTypes.string.isRequired,
        buttonLabel: PropTypes.string.isRequired,
        onWidgetInstalled: PropTypes.func.isRequired,
        className: PropTypes.string
    };

    static defaultProps = {
        className: 'installWidgetModal',
        onWidgetInstalled: () => Promise.resolve()
    };

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState(InstallWidgetModal.initialState);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextState, this.state);
    }

    installWidget() {
        const { widgetFile } = this.state;
        const widgetUrl = widgetFile ? '' : widgetUrl;

        const errors = {};

        if (!widgetFile) {
            if (_.isEmpty(widgetUrl)) {
                errors.widgetUrl = "Please provide the widget's archive URL or select a file";
            } else if (!StageUtils.Url.isUrl(widgetUrl)) {
                errors.widgetUrl = "Please provide valid URL for widget's archive";
            }
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors, scriptError: '' });
            return false;
        }

        this.setState({ loading: true, errors: {}, scriptError: '' });

        EventBus.on('window:error', this.showScriptError, this);
        this.props
            .onWidgetInstalled(widgetFile, widgetUrl)
            .then(() => {
                EventBus.off('window:error', this.showScriptError);
                this.setState({ loading: false, open: false });
            })
            .catch(err => {
                EventBus.off('window:error', this.showScriptError);
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    openModal() {
        this.setState({ ...InstallWidgetModal.initialState, open: true });
    }

    closeModal() {
        this.setState({ open: false });
    }

    showScriptError(message, source, lineno, colno) {
        this.setState({ scriptError: `${message} (${source}:${lineno}:${colno})` });
    }

    onWidgetUrlChange(widgetUrl) {
        this.setState({ errors: {}, widgetUrl, widgetFile: null });
    }

    onWidgetFileChange(widgetFile) {
        this.setState({ errors: {}, widgetUrl: null, widgetFile });
    }

    render() {
        const { errors, loading, open, scriptError } = this.state;
        const { buttonLabel, className, header, trigger } = this.props;
        return (
            <Modal
                trigger={trigger}
                dimmer="blurring"
                open={open}
                className={className}
                onOpen={this.openModal.bind(this)}
                onClose={this.closeModal.bind(this)}
            >
                <Modal.Header>
                    <Icon name="puzzle" /> {header}
                </Modal.Header>
                <Modal.Content>
                    <Form errors={errors} loading={loading}>
                        <Form.Field label="Widget package" required error={errors.widgetUrl}>
                            <Form.UrlOrFile
                                name="widget"
                                placeholder="Provide the widget's archive URL or click browse to select a file"
                                onChangeUrl={this.onWidgetUrlChange.bind(this)}
                                onChangeFile={this.onWidgetFileChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>

                    {scriptError && <Message error>{scriptError}</Message>}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        icon="remove"
                        basic
                        content="Cancel"
                        onClick={event => {
                            event.stopPropagation();
                            this.closeModal();
                        }}
                    />
                    <Button
                        icon="puzzle"
                        content={buttonLabel}
                        color="green"
                        onClick={event => {
                            event.stopPropagation();
                            this.installWidget();
                        }}
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
