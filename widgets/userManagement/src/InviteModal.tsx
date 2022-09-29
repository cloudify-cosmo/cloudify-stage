import type { FunctionComponent } from 'react';
import { useRef, useState } from 'react';
import Actions from './actions';
import getWidgetT from './getWidgetT';
import type { TenantItem, TenantsDropdownProps } from '../../common/src/tenants/TenantsDropdown';
import type { CancelablePromise } from '../../../app/utils/types';
import type { RolesPickerProps } from '../../common/src/roles/RolesPicker';
import AuthServiceActions from './authServiceActions';

const tModal = (key: string) => getWidgetT()(`inviteModal.${key}`);

interface InviteModalProps {
    toolbox: Stage.Types.Toolbox;
}

interface InviteModalInputs {
    email: string;
    isAdmin: boolean;
}

const InviteModal: FunctionComponent<InviteModalProps> = ({ toolbox }) => {
    const { useOpen, useErrors, useBoolean, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [inputs, setInput, clearInputs] = useInputs<InviteModalInputs>({
        email: '',
        isAdmin: false
    });
    const [tenants, setTenants] = useState({});
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    const [availableTenants, setAvailableTenants] = useState<TenantItem[]>([]);

    type Tenants = Stage.Types.PaginatedResponse<{ name: string }>;
    const availableTenantsPromise = useRef<CancelablePromise<Tenants> | null>(null);

    const [isOpen, openModal, closeModal] = useOpen(() => {
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

    function submitInvite() {
        const submitErrors: Partial<Record<keyof InviteModalInputs, string>> = {};
        clearErrors();

        if (!inputs.email || !Stage.Common.Consts.emailRegex.test(inputs.email)) {
            submitErrors.email = tModal('inputs.email.error');
            setErrors(submitErrors);
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        const authServiceActions = new AuthServiceActions(toolbox);

        authServiceActions
            .doInvite(inputs.email)
            .then(() =>
                actions.doCreate(
                    inputs.email,
                    'temporary-password', // TODO: Ask user for password or change API to allow password-less users
                    Stage.Common.Roles.Utils.getSystemRole(inputs.isAdmin)
                )
            )
            .then(() => actions.doHandleTenants(inputs.email, tenants, [], {}))
            .then(closeModal)
            .catch(setMessageAsError)
            .finally(unsetLoading);
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

    const inviteButton = <Button content={tModal('button')} icon="add user" labelPosition="left" />;

    return (
        <Modal trigger={inviteButton} open={isOpen} onOpen={openModal} onClose={closeModal}>
            <Modal.Header>
                <Icon name="add user" /> {tModal('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={tModal('inputs.email.label')} error={errors.email} required>
                        <Form.Input name="email" value={inputs.email} onChange={setInput} />
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
                <CancelButton onClick={closeModal} disabled={isLoading} />
                <ApproveButton onClick={submitInvite} disabled={isLoading} content={tModal('button')} icon="add user" />
            </Modal.Actions>
        </Modal>
    );
};
export default InviteModal;
