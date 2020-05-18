/**
 * Created by jakubniezgoda on 24/03/2017.
 */

export default class UpdateModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = UpdateModal.initialState;
    }

    static initialState = {
        loading: false,
        secretValue: '',
        canUpdateSecret: true,
        errors: {}
    };

    static propTypes = {
        secret: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired,
        open: PropTypes.bool.isRequired,
        onHide: PropTypes.func
    };

    static defaultProps = {
        onHide: () => {}
    };

    onApprove() {
        this.updateSecret();
        return false;
    }

    onCancel() {
        const { onHide } = this.props;
        onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        const { open, secret, toolbox } = this.props;
        if (!prevProps.open && open) {
            this.setState({ ...UpdateModal.initialState, loading: true });

            const actions = new Stage.Common.SecretActions(toolbox);
            actions
                .doGet(secret.key)
                .then(secret => {
                    let canUpdateSecret = true;
                    const {
                        secret: { is_hidden_value }
                    } = this.props;
                    if (is_hidden_value && _.isEmpty(secret.value)) {
                        canUpdateSecret = false;
                    }
                    this.setState({ secretValue: secret.value, loading: false, errors: {}, canUpdateSecret });
                })
                .catch(err => {
                    this.setState({ loading: false, errors: { secretValue: err.message } });
                });
        }
    }

    updateSecret() {
        const { secretValue } = this.state;
        const { onHide, secret, toolbox } = this.props;
        const errors = {};

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
            .doUpdate(secret.key, secretValue)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                onHide();
                toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { onHide, open, secret, toolbox } = this.props;
        const { Modal, Icon, Form, ApproveButton, CancelButton, ErrorMessage } = Stage.Basic;
        const { canUpdateSecret, errors, loading, secretValue } = this.state;
        const currentUsername = toolbox.getManager().getCurrentUsername();
        const selectedTenant = toolbox.getManager().getSelectedTenant();

        return (
            <div>
                <Modal open={open} onClose={() => onHide()}>
                    <Modal.Header>
                        <Icon name="edit" /> Update secret {secret.key}
                    </Modal.Header>

                    <Modal.Content>
                        {!canUpdateSecret && (
                            <ErrorMessage
                                error={`User \`${currentUsername}\` is not permitted to update value of the secret '${secret.key}' in the tenant \`${selectedTenant}\` .`}
                            />
                        )}
                        <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                            {canUpdateSecret && (
                                <Form.Field error={errors.secretValue}>
                                    <Form.TextArea
                                        name="secretValue"
                                        placeholder="Secret value"
                                        autoHeight
                                        value={secretValue}
                                        onChange={this.handleInputChange.bind(this)}
                                    />
                                </Form.Field>
                            )}
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                        {canUpdateSecret && (
                            <ApproveButton
                                onClick={this.onApprove.bind(this)}
                                disabled={loading}
                                content="Update"
                                icon="edit"
                                color="green"
                            />
                        )}
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}
