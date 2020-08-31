/**
 * Created by pposel on 11/04/2017.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EventBus from '../utils/EventBus';
import StageUtils from '../utils/stageUtils';

import { Button, Form, Icon, Message, Modal } from './basic/index';

export default class InstallWidgetModal extends Component {
    static initialState = {
        open: false,
        loading: false,
        widgetUrl: '',
        widgetFile: null,
        errors: {},
        scriptError: ''
    };

    constructor(props, context) {
        super(props, context);

        this.state = InstallWidgetModal.initialState;

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onWidgetUrlChange = this.onWidgetUrlChange.bind(this);
        this.onWidgetFileChange = this.onWidgetFileChange.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextState, this.state) || !_.isEqual(nextProps, this.props);
    }

    installWidget() {
        const { onWidgetInstalled } = this.props;
        const { widgetFile, widgetUrl: stateWidgetUrl } = this.state;
        const widgetUrl = widgetFile ? '' : stateWidgetUrl;

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
        onWidgetInstalled(widgetFile, widgetUrl)
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
                onOpen={this.openModal}
                onClose={this.closeModal}
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
                                onChangeUrl={this.onWidgetUrlChange}
                                onChangeFile={this.onWidgetFileChange}
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

InstallWidgetModal.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    trigger: PropTypes.node.isRequired,
    className: PropTypes.string,
    onWidgetInstalled: PropTypes.func
};

InstallWidgetModal.defaultProps = {
    className: 'installWidgetModal',
    onWidgetInstalled: () => Promise.resolve()
};
