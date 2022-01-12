// @ts-nocheck File not migrated fully to TS

import Actions from './actions';
import SnapshotPropType from './props/SnapshotPropType';

export default function RestoreSnapshotModal({ onHide, snapshot, toolbox, open }) {
    const { useBoolean, useErrors, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [inputs, setInputs] = useInputs({
        isFromTenantlessEnv: false,
        shouldForceRestore: false,
        ignorePluginFailure: false
    });

    function submitRestore() {
        const { ignorePluginFailure, shouldForceRestore } = inputs;

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doRestore(snapshot, shouldForceRestore, ignorePluginFailure)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('snapshots:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const { ignorePluginFailure, isFromTenantlessEnv, shouldForceRestore } = inputs;
    const { Modal, ApproveButton, CancelButton, Icon, Form, Message } = Stage.Basic;

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="undo" /> Restore snapshot
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label="Snapshot from a tenant-less environment"
                            name="isFromTenantlessEnv"
                            checked={isFromTenantlessEnv}
                            onChange={setInputs}
                        />
                    </Form.Field>

                    {isFromTenantlessEnv && (
                        <Message>
                            When restoring from a tenant-less environment, make sure you uploaded the snapshot to a
                            &quot;clean&quot; tenant that does not contain any other resources.
                        </Message>
                    )}
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label="Force restore even if manager is non-empty (it will delete all data)"
                            name="shouldForceRestore"
                            checked={shouldForceRestore}
                            onChange={setInputs}
                        />
                    </Form.Field>
                    <Form.Field help="Ignore plugin installation failures and deployment environment creation failures due to missing plugins">
                        <Form.Checkbox
                            toggle
                            label="Ignore plugin failures"
                            name="ignorePluginFailure"
                            checked={ignorePluginFailure}
                            onChange={setInputs}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton
                    onClick={submitRestore}
                    disabled={isLoading}
                    content="Restore"
                    icon="undo"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

RestoreSnapshotModal.propTypes = {
    onHide: PropTypes.func,
    open: PropTypes.bool.isRequired,
    snapshot: SnapshotPropType.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

RestoreSnapshotModal.defaultProps = {
    onHide: _.noop
};
