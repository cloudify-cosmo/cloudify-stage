import Actions from './actions';

interface CreateModalProps {
    toolbox: Stage.Types.Toolbox;
}

const { Modal, Button, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
const { useBoolean, useErrors, useOpen, useInput } = Stage.Hooks;

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
            setErrors({ tenantName: 'Please provide tenant name' });
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

    const addButton = <Button content="Add" icon="add user" labelPosition="left" />;

    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add user" /> Add tenant
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    {/* @ts-ignore Form.Field is not migrated yet */}
                    <Form.Field error={errors.tenantName}>
                        <Form.Input
                            name="tenantName"
                            placeholder="Tenant name"
                            value={tenantName}
                            onChange={setTenantName}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={createTenant}
                    disabled={isLoading}
                    content="Add"
                    icon="add user"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}
