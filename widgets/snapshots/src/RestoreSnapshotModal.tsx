import type { Snapshot } from 'widgets/snapshots/src/widget.types';
import type { Toolbox } from 'app/utils/StageAPI';
import { noop } from 'lodash';
import Actions from './actions';

const translate = Stage.Utils.getT('widgets.snapshots.restoreModal');

export default function RestoreSnapshotModal({
    onHide = noop,
    snapshot,
    toolbox,
    open
}: {
    onHide?: () => void;
    snapshot: Snapshot;
    toolbox: Toolbox;
    open: boolean;
}) {
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
                <Icon name="undo" /> {translate('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label={translate('form.tenantless.label')}
                            name="isFromTenantlessEnv"
                            checked={isFromTenantlessEnv}
                            onChange={setInputs}
                        />
                    </Form.Field>

                    {isFromTenantlessEnv && <Message>{translate('form.message')}</Message>}
                    <Form.Field>
                        <Form.Checkbox
                            toggle
                            label={translate('form.force.label')}
                            name="shouldForceRestore"
                            checked={shouldForceRestore}
                            onChange={setInputs}
                        />
                    </Form.Field>
                    <Form.Field help={translate('form.ignoreFailure.help')}>
                        <Form.Checkbox
                            toggle
                            label={translate('form.ignoreFailure.label')}
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
                    content={translate('actions.restore')}
                    icon="undo"
                />
            </Modal.Actions>
        </Modal>
    );
}
