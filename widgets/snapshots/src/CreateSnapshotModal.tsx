import type { Toolbox } from 'app/utils/StageAPI';
import type { CheckboxProps, InputOnChangeData } from 'semantic-ui-react';
import type { SnapshotsWidget } from 'widgets/snapshots/src/widget.types';
import { translate } from './widget.common';
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

const translateModal = Stage.Utils.composeT(translate, 'createModal');
const translateError = Stage.Utils.composeT(translate, 'errors');

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
            this.setState({ errors: { snapshotId: translateError('idMissing') } });
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
                trigger={<Button content={translateModal('actions.create')} icon="add" labelPosition="left" />}
                open={open}
                onOpen={() => this.setState({ ...CreateModal.initialState, open: true })}
                onClose={this.onCancel}
            >
                <Modal.Header>
                    <Icon name="add" /> {translateModal('header')}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={loading} errors={errors} onErrorsDismiss={() => this.setState({ errors: {} })}>
                        <Form.Field label={translateModal('form.id.label')} required error={errors.snapshotId}>
                            <Form.Input name="snapshotId" value={snapshotId} onChange={this.handleInputChange} />
                        </Form.Field>

                        <Form.Field help={translateModal('form.includeCredentials.help')}>
                            <Form.Checkbox
                                toggle
                                label={translateModal('form.includeCredentials.label')}
                                name="includeCredentials"
                                checked={includeCredentials}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field help={translateModal('form.excludeLogs.help')}>
                            <Form.Checkbox
                                toggle
                                label={translateModal('form.excludeLogs.label')}
                                name="excludeLogs"
                                checked={excludeLogs}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field help={translateModal('form.excludeEvents.help')}>
                            <Form.Checkbox
                                toggle
                                label={translateModal('form.excludeEvents.label')}
                                name="excludeEvents"
                                checked={excludeEvents}
                                onChange={this.handleInputChange}
                            />
                        </Form.Field>

                        <Form.Field help={translateModal('form.queue.help')}>
                            <Form.Checkbox
                                toggle
                                label={translateModal('form.queue.label')}
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
                        content={translateModal('actions.create')}
                        icon="add"
                    />
                </Modal.Actions>
            </Modal>
        );
    }
}
