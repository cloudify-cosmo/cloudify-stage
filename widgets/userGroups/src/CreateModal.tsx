// @ts-nocheck File not migrated fully to TS
import Actions from './actions';

const t = Stage.Utils.getT('widgets.userGroups.modals.create');

interface CreateModalProps {
    toolbox: Stage.Types.Toolbox;
    isLdapEnabled?: boolean;
}

const CreateModal = ({ toolbox, isLdapEnabled = false }: CreateModalProps) => {
    const { useEffect, useState, useRef } = React;
    const { useBoolean, useErrors, useOpen, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [inputs, setInput, clearInputs] = useInputs({ groupName: '', ldapGroup: '', isAdmin: false });
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearInputs();
        setTenants({});
        clearErrors();

        const actions = new Actions(toolbox);
        availableTenantsPromise.current = Stage.Utils.makeCancelable(actions.doGetTenants());

        availableTenantsPromise.current.promise
            .then(resolvedTenants => {
                unsetLoading();
                setAvailableTenants(resolvedTenants);
            })
            .catch(err => {
                if (!err.isCanceled) {
                    unsetLoading();
                    setAvailableTenants({ items: [] });
                }
            });
    });

    useEffect(() => {
        return () => {
            if (availableTenantsPromise.current) {
                availableTenantsPromise.current.cancel();
            }
        };
    }, []);

    const [tenants, setTenants] = useState({});
    const [availableTenants, setAvailableTenants] = useState({});
    const availableTenantsPromise = useRef(null);

    function submitCreate() {
        const { groupName, isAdmin, ldapGroup } = inputs;

        if (_.isEmpty(groupName)) {
            const validationMessage = t('validation.groupName');
            setErrors({ groupName: validationMessage });
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doCreate(groupName, ldapGroup, Stage.Common.Roles.Utils.getSystemRole(isAdmin))
            .then(() => actions.doHandleTenants(groupName, tenants, [], []))
            .then(() => {
                clearErrors();
                doClose();
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function handleRoleChange(tenant, role) {
        const newTenants = { ...tenants };
        newTenants[tenant] = role;
        setTenants(newTenants);
    }

    function handleTenantChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] =
                tenants[tenant] || Stage.Common.Roles.Utils.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setTenants(newTenants);
    }

    const { groupName, isAdmin, ldapGroup } = inputs;
    const { Modal, Button, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
    const RolesPicker = Stage.Common.Roles.Picker;

    const addButton = <Button content={t('buttons.add')} icon="add user" labelPosition="left" />;

    const options = _.map(availableTenants.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });
    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add user" />
                {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.groupName} label={t('fields.groupName')}>
                        <Form.Input name="groupName" value={groupName} onChange={setInput} />
                    </Form.Field>

                    {isLdapEnabled && (
                        <Form.Field error={errors.ldapGroup} label={t('fields.ldapGroup')}>
                            <Form.Input name="ldapGroup" value={ldapGroup} onChange={setInput} />
                        </Form.Field>
                    )}

                    <Form.Field error={errors.isAdmin}>
                        <Form.Checkbox label={t('fields.admin')} name="isAdmin" checked={isAdmin} onChange={setInput} />
                    </Form.Field>

                    <Form.Field label="Tenants">
                        <Form.Dropdown
                            name="tenants"
                            multiple
                            selection
                            options={options}
                            value={Object.keys(tenants)}
                            onChange={handleTenantChange}
                        />
                    </Form.Field>
                    <RolesPicker
                        onUpdate={handleRoleChange}
                        resources={tenants}
                        resourceName="tenant"
                        toolbox={toolbox}
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={submitCreate}
                    disabled={isLoading}
                    content={t('buttons.add')}
                    icon="add user"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
};

export default CreateModal;
