import type { FunctionComponent } from 'react';
import Actions from './actions';
import type { CancelablePromise } from '../../../app/utils/types';
import type { RolesPickerProps } from '../../../app/widgets/common/roles/RolesPicker';
import type { TenantItem, TenantsDropdownProps } from '../../../app/widgets/common/tenants/TenantsDropdown';
import getWidgetT from './getWidgetT';

const tModal = (key: string) => getWidgetT()(`createModal.${key}`);

interface CreateModalProps {
    toolbox: Stage.Types.Toolbox;
}
interface CreateModalInputs {
    username: string;
    password: string;
    confirmPassword: string;
    isAdmin: boolean;
}
const CreateModal: FunctionComponent<CreateModalProps> = ({ toolbox }) => {
    const { useEffect, useState, useRef } = React;
    const { useOpen, useErrors, useBoolean, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [inputs, setInput, clearInputs] = useInputs<CreateModalInputs>({
        username: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
    });
    const [tenants, setTenants] = useState({});
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [availableTenants, setAvailableTenants] = useState<TenantItem[]>([]);

    type Tenants = Stage.Types.PaginatedResponse<{ name: string }>;
    const availableTenantsPromise = useRef<CancelablePromise<Tenants> | null>(null);

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
                setAvailableTenants(resolvedTenants.items);
            })
            .catch((err: any) => {
                if (!err.isCanceled) {
                    unsetLoading();
                    setAvailableTenants([]);
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
        const submitErrors: Partial<Record<keyof CreateModalInputs, string>> = {};

        if (_.isEmpty(inputs.username)) {
            submitErrors.username = tModal('inputs.username.error');
        }

        if (_.isEmpty(inputs.password)) {
            submitErrors.password = tModal('inputs.password.error');
        }

        if (_.isEmpty(inputs.confirmPassword)) {
            submitErrors.confirmPassword = tModal('inputs.confirmPassword.error');
        }

        if (
            !_.isEmpty(inputs.password) &&
            !_.isEmpty(inputs.confirmPassword) &&
            inputs.password !== inputs.confirmPassword
        ) {
            submitErrors.confirmPassword = tModal('inputs.confirmPassword.notMatchError');
        }

        if (!_.isEmpty(submitErrors)) {
            setErrors(submitErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doCreate(inputs.username, inputs.password, Stage.Common.Roles.Utils.getSystemRole(inputs.isAdmin))
            .then(() => actions.doHandleTenants(inputs.username, tenants, [], {}))
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

    const handleTenantChange: TenantsDropdownProps['onChange'] = (_event, { value }: { value?: string[] }) => {
        const newTenants = Stage.Common.Tenants.mapTenantsToRoles(value, tenants, toolbox);
        setTenants(newTenants);
    };

    const handleRoleChange: RolesPickerProps['onUpdate'] = (tenant, role) => {
        const newTenants = { ...tenants, [tenant]: role };
        setTenants(newTenants);
    };

    const { ApproveButton, Button, CancelButton, Icon, Form, Message, Modal } = Stage.Basic;
    const RolesPicker = Stage.Common.Roles.Picker;
    const { TenantsDropdown } = Stage.Common.Tenants;

    const addButton = (
        <Button content={tModal('button')} icon="add user" labelPosition="left" className="addUserButton" />
    );

    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose} className="addUserModal">
            <Modal.Header>
                <Icon name="add user" /> {tModal('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={tModal('inputs.username.label')} error={errors.username} required>
                        <Form.Input name="username" value={inputs.username} onChange={setInput} />
                    </Form.Field>

                    <Form.Field label={tModal('inputs.password.label')} error={errors.password} required>
                        <Form.Input name="password" type="password" value={inputs.password} onChange={setInput} />
                    </Form.Field>

                    <Form.Field label={tModal('inputs.confirmPassword.label')} error={errors.confirmPassword} required>
                        <Form.Input
                            name="confirmPassword"
                            type="password"
                            value={inputs.confirmPassword}
                            onChange={setInput}
                        />
                    </Form.Field>

                    <Form.Field error={errors.isAdmin}>
                        <Form.Checkbox
                            label={tModal('inputs.isAdmin.label')}
                            name="isAdmin"
                            checked={inputs.isAdmin}
                            onChange={setInput}
                        />
                    </Form.Field>

                    {inputs.isAdmin && <Message>{tModal('inputs.isAdmin.note')}</Message>}

                    <TenantsDropdown
                        value={Object.keys(tenants)}
                        availableTenants={availableTenants}
                        onChange={handleTenantChange}
                    />
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
                <ApproveButton onClick={onApprove} disabled={isLoading} content={tModal('button')} icon="add user" />
            </Modal.Actions>
        </Modal>
    );
};
export default CreateModal;
