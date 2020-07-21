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

    onApprove() {
        this.createSecret();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        const { open } = this.state;
        if (!prevState.open && open) {
            this.setState(CreateModal.initialState);
        }
    }

    createSecret() {
        const { isHiddenValue, secretKey, secretValue, visibility } = this.state;
        const { toolbox } = this.props;
        const errors = {};

        if (_.isEmpty(secretKey)) {
            errors.secretKey = 'Please provide secret key';
        }

        if (_.isEmpty(secretValue)) {
            errors.secretValue = 'Please provide secret value';
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Stage.Common.SecretActions(toolbox);
        actions
            .doCreate(secretKey, secretValue, visibility, isHiddenValue)
            .then(() => {
                this.setState({ errors: {}, loading: false, open: false });
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    onSecretFileChange(file) {
        const { toolbox } = this.props;

        if (!file) {
            this.setState({ secretValue: '', errors: {} });
            return;
        }

        this.setState({ fileLoading: true });

        const actions = new Stage.Common.FileActions(toolbox);
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
        const { errors, fileLoading, isHiddenValue, loading, open, secretKey, secretValue, visibility } = this.state;
        const { ApproveButton, Button, CancelButton, Checkbox, Icon, Form, Modal, VisibilityField } = Stage.Basic;
        const createButton = <Button content="Create" icon="add" labelPosition="left" />;

        return (
            <Modal
                trigger={createButton}
                open={open}
                onOpen={() => this.setState({ open: true })}
                onClose={() => this.setState({ open: false })}
            >
                <Modal.Header>
                    <Icon name="add" /> Create secret
                    <VisibilityField
                        visibility={visibility}
                        className="rightFloated"
                        onVisibilityChange={visibility => this.setState({ visibility })}
                    />
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field error={errors.secretKey}>
                            <Form.Input
                                name="secretKey"
                                placeholder="Secret key"
                                value={secretKey}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field error={errors.secretValue}>
                            <Form.TextArea
                                name="secretValue"
                                placeholder="Secret value"
                                autoHeight
                                value={secretValue}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field error={errors.secretFile}>
                            <Form.File
                                name="secretFile"
                                placeholder="Get secret value from file (max: 50kB)"
                                ref="secretFile"
                                onChange={this.onSecretFileChange.bind(this)}
                                loading={fileLoading}
                                disabled={fileLoading}
                            />
                        </Form.Field>
                        <Form.Field error={errors.isHiddenValue}>
                            <Form.Checkbox
                                name="isHiddenValue"
                                label="Hidden Value"
                                checked={isHiddenValue}
                                onChange={this.handleInputChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Create"
                        icon="add"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}

CreateModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
