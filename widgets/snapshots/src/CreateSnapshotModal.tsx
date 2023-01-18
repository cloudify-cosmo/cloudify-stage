import type { Toolbox } from 'app/utils/StageAPI';
import type { CheckboxProps, InputOnChangeData } from 'semantic-ui-react';
import type { SnapshotsWidget } from 'widgets/snapshots/src/widget.types';
import Actions from './actions';

interface CreateModalProps {
    toolbox: Toolbox;
    widget: SnapshotsWidget;
}

interface CreateModalState {
    errors: Record<string, string>;
    excludeLogs: boolean;
    excludeEvents: boolean;
    includeCredentials: boolean;
    queue: boolean;
    open?: boolean;
    loading?: boolean;
    snapshotId: string;
}

export default class CreateModal extends React.Component<CreateModalProps, CreateModalState> {
    static initialState = {
        snapshotId: '',
        errors: {},
        includeCredentials: false,
        excludeLogs: false,
        excludeEvents: false,
        queue: false
    };

    constructor(props: CreateModalProps) {
        super(props);

        this.state = CreateModal.initialState;

        this.onApprove = this.onApprove.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(_proxy: unknown, field: CheckboxProps | InputOnChangeData) {
        this.setState(
            Stage.Basic.Form.fieldNameValue({ name: '', value: '', type: '', ...field }) as unknown as CreateModalState
        );
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

        if (_.isEmpty(snapshotId)) {
            this.setState({ errors: { snapshotId: 'Please provide snapshot ID' } });
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
            .catch((err: any) => {
                this.setState({ errors: { error: err.message }, loading: false });
            });
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
                    <ApproveButton onClick={this.onApprove} disabled={loading} content="Create" icon="add" />
                </Modal.Actions>
            </Modal>
        );
    }
}
