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
        this.props.onHide();
        return true;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.open && this.props.open) {
            this.setState({ ...UpdateModal.initialState, loading: true });

            const actions = new Stage.Common.SecretActions(this.props.toolbox);
            actions
                .doGet(this.props.secret.key)
                .then(secret => {
                    let canUpdateSecret = true;
                    if (this.props.secret.is_hidden_value && _.isEmpty(secret.value)) {
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
        const errors = {};

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
            .doUpdate(this.props.secret.key, this.state.secretValue)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                this.props.onHide();
                this.props.toolbox.refresh();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { Modal, Icon, Form, ApproveButton, CancelButton, ErrorMessage } = Stage.Basic;
        const { canUpdateSecret } = this.state;
        const currentUsername = this.props.toolbox.getManager().getCurrentUsername();
        const selectedTenant = this.props.toolbox.getManager().getSelectedTenant();

        return (
            <div>
                <Modal open={this.props.open} onClose={() => this.props.onHide()}>
                    <Modal.Header>
                        <Icon name="edit" /> Update secret {this.props.secret.key}
                    </Modal.Header>

                    <Modal.Content>
                        {!canUpdateSecret && (
                            <ErrorMessage
                                error={`User \`${currentUsername}\` is not permitted to update value of the secret '${this.props.secret.key}' in the tenant \`${selectedTenant}\` .`}
                            />
                        )}
                        <Form
                            loading={this.state.loading}
                            errors={this.state.errors}
                            onErrorsDismiss={() => this.setState({ errors: {} })}
                        >
                            {canUpdateSecret && (
                                <Form.Field error={this.state.errors.secretValue}>
                                    <Form.TextArea
                                        name="secretValue"
                                        placeholder="Secret value"
                                        autoHeight
                                        value={this.state.secretValue}
                                        onChange={this.handleInputChange.bind(this)}
                                    />
                                </Form.Field>
                            )}
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                        {canUpdateSecret && (
                            <ApproveButton
                                onClick={this.onApprove.bind(this)}
                                disabled={this.state.loading}
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
