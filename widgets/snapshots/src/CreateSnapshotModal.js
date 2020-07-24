/**
 * Created by kinneretzin on 05/10/2016.
 */

import Actions from './actions';

export default class CreateModal extends React.Component {
    static initialState = {
        loading: false,
        snapshotId: '',
        includeCredentials: false,
        excludeLogs: false,
        excludeEvents: false,
        queue: false,
        errors: {},
        open: false
    };

    constructor(props, context) {
        super(props, context);

        this.state = CreateModal.initialState;

        this.onApprove = this.onApprove.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    onApprove() {
        this.submitCreate();
        return false;
    }

    onCancel() {
        this.setState({ open: false });
        return true;
    }

    submitCreate() {
        const { toolbox, widget } = this.props;
        const { snapshotId, includeCredentials, excludeLogs, excludeEvents, queue } = this.state;
        const errors = {};

        if (_.isEmpty(snapshotId)) {
            errors.snapshotId = 'Please provide snapshot ID';
        } else {
            const URL_SAFE_CHARACTERS_RE = /^[0-9a-zA-Z\$\-\_\.\+\!\*\'\(\)\,]+$/;
            if (!URL_SAFE_CHARACTERS_RE.test(snapshotId)) {
                errors.snapshotId =
                    'Please use safe characters. Letters, digits and the following ' +
                    "special characters $-_.+!*'(), are allowed";
            }
        }

        if (!_.isEmpty(errors)) {
            this.setState({ errors });
            return;
        }

        // Disable the form
        this.setState({ loading: true });

        // Call create method
        const actions = new Actions(toolbox);

        actions
            .doCreate(snapshotId, includeCredentials, excludeLogs, excludeEvents, queue)
            .then(() => {
                toolbox.getContext().setValue(`${widget.id}createSnapshot`, null);
                toolbox.getEventBus().trigger('snapshots:refresh');
                this.setState({ errors: {}, loading: false, open: false });
            })
            .catch(err => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
    }

    handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    render() {
        const { errors, excludeLogs, excludeEvents, includeCredentials, open, loading, snapshotId, queue } = this.state;
        const { Modal, Button, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

        return (
            <Modal
                trigger={<Button content="Create" icon="add" labelPosition="left" />}
                open={open}
                onOpen={() => this.setState({ ...CreateModal.initialState, open: true })}
                onClose={this.onCancel}
            >
                <Modal.Header>
                    <Icon name="add" /> Create snapshot
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field label="Snapshot ID" required error={errors.snapshotId}>
                            <Form.Input name="snapshotId" value={snapshotId} onChange={this.handleInputChange} />
                        </Form.Field>

                        <Form.Field help="Includes agent SSH keys (including those specified in uploaded blueprints) in the snapshot">
                            <Form.Checkbox
                                toggle
                                label="Include credentials"
                                name="includeCredentials"
                                checked={includeCredentials}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field help="Exclude logs from the snapshot">
                            <Form.Checkbox
                                toggle
                                label="Exclude logs"
                                name="excludeLogs"
                                checked={excludeLogs}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field help="Exclude events from the snapshot">
                            <Form.Checkbox
                                toggle
                                label="Exclude events"
                                name="excludeEvents"
                                checked={excludeEvents}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field help="Queue snapshot creation workflow and run automatically when possible">
                            <Form.Checkbox
                                toggle
                                label="Queue"
                                name="queue"
                                checked={queue}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onCancel} disabled={loading} />
                    <ApproveButton
                        onClick={this.onApprove}
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
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    widget: Stage.PropTypes.Widget.isRequired
};
