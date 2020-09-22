/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';

export default function CreateModal({ toolbox }) {
    const { useEffect, useState, useRef } = React;
    const { useOpen, useErrors, useBoolean, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [inputs, setInput, clearInputs] = useInputs({
        username: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
    });
    const [tenants, setTenants] = useState({});
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [availableTenants, setAvailableTenants] = useState({});

    const availableTenantsPromise = useRef(null);

    const [isOpen, doOpen, doClose] = useOpen(() => {
        setLoading();
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

    function submitCreate() {
        const submitErrors = {};

        if (_.isEmpty(inputs.username)) {
            submitErrors.username = 'Please provide username';
        }

        if (_.isEmpty(inputs.password)) {
            submitErrors.password = 'Please provide user password';
        }

        if (_.isEmpty(inputs.confirmPassword)) {
            submitErrors.confirmPassword = 'Please provide password confirmation';
        }

        if (
            !_.isEmpty(inputs.password) &&
            !_.isEmpty(inputs.confirmPassword) &&
            inputs.password !== inputs.confirmPassword
        ) {
            submitErrors.confirmPassword = 'Passwords do not match';
        }

        if (!_.isEmpty(submitErrors)) {
            setErrors(submitErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doCreate(inputs.username, inputs.password, Stage.Common.RolesUtil.getSystemRole(inputs.isAdmin))
            .then(() => actions.doHandleTenants(inputs.username, tenants, [], []))
            .then(() => {
                clearErrors();
                doClose();
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function onApprove() {
        submitCreate();
        return false;
    }

    function handleTenantChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] =
                tenants[tenant] || Stage.Common.RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setTenants(newTenants);
    }

    function handleRoleChange(tenant, role) {
        const newTenants = { ...tenants };
        newTenants[tenant] = role;
        setTenants(newTenants);
    }

    const { ApproveButton, Button, CancelButton, Icon, Form, Message, Modal } = Stage.Basic;
    const { RolesPicker } = Stage.Common;

    const addButton = <Button content="Add" icon="add user" labelPosition="left" className="addUserButton" />;

    const options = _.map(availableTenants.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose} className="addUserModal">
            <Modal.Header>
                <Icon name="add user" /> Add user
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label="Username" error={errors.username} required>
                        <Form.Input name="username" value={inputs.username} onChange={setInput} />
                    </Form.Field>

                    <Form.Field label="Password" error={errors.password} required>
                        <Form.Input name="password" type="password" value={inputs.password} onChange={setInput} />
                    </Form.Field>

                    <Form.Field label="Confirm password" error={errors.confirmPassword} required>
                        <Form.Input
                            name="confirmPassword"
                            type="password"
                            value={inputs.confirmPassword}
                            onChange={setInput}
                        />
                    </Form.Field>

                    <Form.Field error={errors.isAdmin}>
                        <Form.Checkbox label="Admin" name="isAdmin" checked={inputs.isAdmin} onChange={setInput} />
                    </Form.Field>

                    {inputs.isAdmin && (
                        <Message>Admin users have full permissions to all tenants on the manager.</Message>
                    )}

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
                <ApproveButton onClick={onApprove} disabled={isLoading} content="Add" icon="add user" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

CreateModal.propTypes = { toolbox: Stage.PropTypes.Toolbox.isRequired };
