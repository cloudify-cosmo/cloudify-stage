import type { FunctionComponent } from 'react';
import { useEffect, useRef, useState } from 'react';
import getWidgetT from './getWidgetT';
import AuthServiceActions from './authServiceActions';
import type { TenantItem, TenantsDropdownProps } from '../../../app/widgets/common/tenants/TenantsDropdown';
import Actions from './actions';
import type { CancelablePromise } from '../../../app/utils/types';
import type { RolesPickerProps } from '../../../app/widgets/common/roles/RolesPicker';
import type { RolesAssignment } from '../../../app/widgets/common/tenants/utils';

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
    const [tenants, setTenants] = useState<RolesAssignment>({});
    const [availableTenants, setAvailableTenants] = useState<TenantItem[]>([]);
    type Tenants = Stage.Types.PaginatedResponse<{ name: string }>;
    const availableTenantsPromise = useRef<CancelablePromise<Tenants> | null>(null);
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    const [isOpen, openModal, closeModal] = useOpen(() => {
        clearInputs();
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

        const authServiceActions = new AuthServiceActions(toolbox);

        authServiceActions
            .doInvite(inputs.email, inputs.isAdmin, tenants)
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
