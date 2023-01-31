import { isEmpty, isEqual, isNil, noop } from 'lodash';
import React, { Component } from 'react';
import EventBus from '../../../utils/EventBus';
import StageUtils from '../../../utils/stageUtils';
import { ApproveButton, Button, Form, Icon, Message, Modal } from '../../basic';

const translate = StageUtils.getT('editMode.addWidget.installModal');

interface InstallWidgetModalProps {
    buttonLabel: string;
    header: string;
    trigger: JSX.Element;
    className: string;
    onWidgetInstalled: (widgetFile: File | null, widgetUrl: string) => Promise<void>;
}

interface InstallWidgetModalState {
    open: boolean;
    loading: boolean;
    widgetUrl: string;
    widgetFile: File | null;
    errors: Record<string, string>;
    scriptError: string;
}

export default class InstallWidgetModal extends Component<InstallWidgetModalProps, InstallWidgetModalState> {
    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {
        className: 'installWidgetModal',
        onWidgetInstalled: () => Promise.resolve()
    };

    static initialState = {
        open: false,
        loading: false,
        widgetUrl: '',
        widgetFile: null,
        errors: {},
        scriptError: ''
    };

    constructor(props: InstallWidgetModalProps) {
        super(props);

        this.state = InstallWidgetModal.initialState;
    }

    shouldComponentUpdate(nextProps: InstallWidgetModalProps, nextState: InstallWidgetModalState) {
        return !isEqual(nextState, this.state) || !isEqual(nextProps, this.props);
    }

    openModal = () => {
        this.setState({ ...InstallWidgetModal.initialState, open: true });
    };

    closeModal = () => {
        this.setState({ open: false });
    };

    onWidgetUrlChange = (widgetUrl: string) => {
        this.setState({ errors: {}, widgetUrl, widgetFile: null });
    };

    onWidgetFileChange = (widgetFile: File) => {
        this.setState({ errors: {}, widgetUrl: '', widgetFile });
    };

    showScriptError(message: string, source: string, lineno: string, colno: string) {
        this.setState({ scriptError: `${message} (${source}:${lineno}:${colno})` });
    }

    installWidget() {
        const { onWidgetInstalled } = this.props;
        const { widgetFile, widgetUrl: stateWidgetUrl } = this.state;
        const widgetUrl = widgetFile ? '' : stateWidgetUrl;

        const errors: { widgetUrl?: string } = {};

        if (isNil(widgetFile)) {
            if (!widgetUrl) {
                errors.widgetUrl = translate('error.noFileOrUrl');
            } else if (!StageUtils.Url.isUrl(widgetUrl)) {
                errors.widgetUrl = translate('error.invalidUrl');
            }
        }

        if (!isEmpty(errors)) {
            this.setState({ errors, scriptError: '' });
            return false;
        }

        this.setState({ loading: true, errors: {}, scriptError: '' });

        EventBus.on('window:error', this.showScriptError, this);
        return onWidgetInstalled(widgetFile, widgetUrl)
            .then(() => {
                EventBus.off('window:error', this.showScriptError);
                this.setState({ loading: false, open: false });
            })
            .catch(err => {
                EventBus.off('window:error', this.showScriptError);
                this.setState({ errors: { error: err.message }, loading: false });
            });
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
                        <Form.Field label={translate('fileOrUrlLabel')} required error={errors.widgetUrl}>
                            <Form.UrlOrFile
                                name="widget"
                                placeholder={translate('fileOrUrlPlaceholder')}
                                onChangeUrl={this.onWidgetUrlChange}
                                onChangeFile={this.onWidgetFileChange}
                                onBlurUrl={noop}
                            />
                        </Form.Field>
                    </Form>

                    {scriptError && <Message error>{scriptError}</Message>}
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        icon="remove"
                        basic
                        content={translate('cancelButton')}
                        onClick={event => {
                            event.stopPropagation();
                            this.closeModal();
                        }}
                    />
                    <ApproveButton
                        icon="puzzle"
                        content={buttonLabel}
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
