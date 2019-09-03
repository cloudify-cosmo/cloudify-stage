/**
 * Created by jakubniezgoda on 24/03/2017.
 */

export default class CreateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...CreateModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        secretKey: '',
        secretValue: '',
        secretFile: null,
        errors: {},
        visibility: Stage.Common.Consts.defaultVisibility,
        isHiddenValue: false
    };

    static propTypes = {
        toolbox: PropTypes.object.isRequired
    };

    onApprove() {
        this._createSecret();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(CreateModal.initialState);
        }
    }

    _createSecret() {
        const errors = {};

        if (_.isEmpty(this.state.secretKey)) {
            errors.secretKey = 'Please provide secret key';
        }

        if (_.isEmpty(this.state.secretValue)) {
            errors.secretValue = 'Please provide secret value';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Stage.Common.SecretActions(this.props.toolbox);
        actions
            .doCreate(this.state.secretKey, this.state.secretValue, this.state.visibility, this.state.isHiddenValue)
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _onSecretFileChange(file) {
        if (!file) {
            this.setState({ secretValue: '', errors: {} });
            return;
        }

        this.setState({ fileLoading: true });

        const actions = new Stage.Common.FileActions(this.props.toolbox);
        actions
            .doGetTextFileContent(file)
            .then(fileContent => {
                this.setState({ secretValue: fileContent, errors: {}, fileLoading: false });
            })
            .catch(err => {
                this.setState({ secretValue: '', errors: { error: err.message }, fileLoading: false });
            });
    }

    render() {
        const { ApproveButton, Button, CancelButton, Checkbox, Icon, Form, Modal, VisibilityField } = Stage.Basic;
        const createButton = <Button content="Create" icon="add" labelPosition="left" />;

        return (
            <Modal
                trigger={createButton}
                open={this.state.open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
            >
                <Modal.Header>
                    <Icon name="add" /> Create secret
                    <VisibilityField
                        visibility={this.state.visibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form
                        loading={this.state.loading}
                        errors={this.state.errors}
                        onErrorsDismiss={() => this.setState({ errors: {} })}
                    >
                        <Form.Field error={this.state.errors.secretKey}>
                            <Form.Input
                                name="secretKey"
                                placeholder="Secret key"
                                value={this.state.secretKey}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field error={this.state.errors.secretValue}>
                            <Form.TextArea
                                name="secretValue"
                                placeholder="Secret value"
                                autoHeight
                                value={this.state.secretValue}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field error={this.state.errors.secretFile}>
                            <Form.File
                                name="secretFile"
                                placeholder="Get secret value from file (max: 50kB)"
                                ref="secretFile"
                                onChange={this._onSecretFileChange.bind(this)}
                                loading={this.state.fileLoading}
                                disabled={this.state.fileLoading}
                            />
                        </Form.Field>
                        <Form.Field error={this.state.errors.isHiddenValue}>
                            <Form.Checkbox
                                name="isHiddenValue"
                                label="Hidden Value"
                                checked={this.state.isHiddenValue}
                                onChange={this._handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={this.state.loading}
                        content="Create"
                        icon="add"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
