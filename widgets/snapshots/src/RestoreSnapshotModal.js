/**
 * Created by kinneretzin on 03/21/2017.
 */

import Actions from './actions';

export default class RestoreSnapshotModal extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = { ...RestoreSnapshotModal.initialState, open: false };
    }

    static initialState = {
        loading: false,
        errors: {},
        isFromTenantlessEnv: false,
        shouldForceRestore: false,
        ignorePluginFailure: false
    };

    static propTypes = {
        snapshot: PropTypes.object.isRequired,
        toolbox: PropTypes.object.isRequired
    };

    static defaultProps = {
        onHide: _.noop
    };

    onApprove() {
        this.submitRestore();
        return false;
    }

    onCancel() {
        this.props.onHide();
        return true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.setState(RestoreSnapshotModal.initialState);
        }
    }

    submitRestore() {
        const { ignorePluginFailure, shouldForceRestore } = this.state;
        const { onHide, snapshot, toolbox } = this.props;
        const errors = {};

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return false;
        }

        // Disable the form
        this.setState({ loading: true });

        const actions = new Actions(toolbox);
        actions
            .doRestore(snapshot, shouldForceRestore, ignorePluginFailure)
            .then(() => {
                this.setState({ errors: {}, loading: false });
                toolbox.refresh();
                toolbox.getEventBus().trigger('snapshots:refresh');
                toolbox.getEventBus().trigger('menu.tenants:refresh');
                onHide();
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleFieldChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { errors, ignorePluginFailure, isFromTenantlessEnv, loading, shouldForceRestore } = this.state;
        const { onHide, open } = this.props;
        const { Modal, ApproveButton, CancelButton, Icon, Form, Message } = Stage.Basic;

        return (
            <Modal open={open} onClose={() => onHide()}>
                <Modal.Header>
                    <Icon name="undo" /> Restore snapshot
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field>
                            <Form.Checkbox
                                toggle
                                label="Snapshot from a tenant-less environment"
                                name="isFromTenantlessEnv"
                                checked={isFromTenantlessEnv}
                                onChange={this.handleFieldChange.bind(this)}
                            />
                        </Form.Field>

                        {isFromTenantlessEnv && (
                            <Message>
                                When restoring from a tenant-less environment, make sure you uploaded the snapshot to a
                                "clean" tenant that does not contain any other resources.
                            </Message>
                        )}
                        <Form.Field>
                            <Form.Checkbox
                                toggle
                                label="Force restore even if manager is non-empty (it will delete all data)"
                                name="shouldForceRestore"
                                checked={shouldForceRestore}
                                onChange={this.handleFieldChange.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field help="Ignore plugin installation failures and deployment environment creation failures due to missing plugins">
                            <Form.Checkbox
                                toggle
                                label="Ignore plugin failures"
                                name="ignorePluginFailure"
                                checked={ignorePluginFailure}
                                onChange={this.handleFieldChange.bind(this)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel.bind(this)} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove.bind(this)}
                        disabled={loading}
                        content="Restore"
                        icon="undo"
                        color="green"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
