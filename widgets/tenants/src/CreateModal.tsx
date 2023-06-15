import Actions from './actions';

interface CreateModalProps {
    toolbox: Stage.Types.Toolbox;
}

const { Modal, Button, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
const { useBoolean, useErrors, useOpen, useInput } = Stage.Hooks;

const translate = Stage.Utils.getT(`widgets.tenants.createModal`);

export default function CreateModal({ toolbox }: CreateModalProps) {
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [tenantName, setTenantName, clearTenantName] = useInput('');

    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearErrors();
        clearTenantName();
    });

    function createTenant() {
        if (_.isEmpty(tenantName)) {
            setErrors({ tenantName: translate('form.errors.emptyTenantName') });
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doCreate(tenantName)
            .then(() => {
                doClose();
                clearErrors();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const addButton = <Button content={translate('form.buttons.addTenant')} icon="add user" labelPosition="left" />;

    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add user" /> {translate('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.tenantName} label={translate('form.fields.tenantName')}>
                        <Form.Input name="tenantName" value={tenantName} onChange={setTenantName} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={createTenant}
                    disabled={isLoading}
                    content={translate('form.buttons.addTenant')}
                    icon="add user"
                />
            </Modal.Actions>
        </Modal>
    );
}
