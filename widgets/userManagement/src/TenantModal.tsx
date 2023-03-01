import type { DropdownProps } from 'semantic-ui-react';
import type { FunctionComponent } from 'react';
import Actions from './actions';
import type { User } from './widget.types';
import type { Role } from '../../../app/widgets/common/roles/RolesPicker';
import type { RolesAssignment } from '../../../app/widgets/common/tenants/utils';
import getWidgetT from './getWidgetT';

const t = getWidgetT();
const RolesPicker = Stage.Common.Roles.Picker;
const { getDefaultRoleName } = Stage.Common.Roles.Utils;

export interface TenantModalProps {
    onHide: () => void;
    open: boolean;
    tenants: string[];
    toolbox: Stage.Types.Toolbox;
    user: User;
}

const TenantModal: FunctionComponent<TenantModalProps> = ({ onHide, open, user, toolbox, tenants }) => {
    const { useBoolean, useErrors, useOpenProp, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedTenants, setEditedTenants] = useInput<RolesAssignment>({});
    const { errors, setMessageAsError, clearErrors } = useErrors();

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        setEditedTenants(
            _.mapValues(
                _.pickBy(user.tenants, rolesObj => {
                    return !_.isEmpty(rolesObj['tenant-role']);
                }),
                rolesObj => {
                    return rolesObj['tenant-role'];
                }
            )
        );
    });

    function onRoleChange(tenant: string, role: Role) {
        const newTenants = { ...editedTenants };
        newTenants[tenant] = role;
        setEditedTenants(newTenants);
    }

    function submitTenant() {
        // Disable the form
        setLoading();

        const userTenants = user.tenant_roles.direct;
        const tenantsList = Object.keys(userTenants);
        const submitTenantsList = Object.keys(editedTenants);

        const tenantsToAdd: RolesAssignment = _.pick(editedTenants, _.difference(submitTenantsList, tenantsList));
        const tenantsToRemove: string[] = _.difference(tenantsList, submitTenantsList);
        const tenantsToUpdate: RolesAssignment = _.pickBy(editedTenants, (role, tenant) => {
            return userTenants[tenant] && !_.isEqual(userTenants[tenant], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleTenants(user.username, tenantsToAdd, tenantsToRemove, tenantsToUpdate)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const handleInputChange: DropdownProps['onChange'] = (_event, field) => {
        const newTenants: RolesAssignment = {};
        _.forEach(field.value as string[], tenant => {
            newTenants[tenant] = editedTenants[tenant] || getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedTenants(newTenants);
    };

    const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

    const options = _.map(tenants, tenant => {
        return { text: tenant, value: tenant, key: tenant };
    });

    return (
        <Modal open={open} onClose={() => onHide()} className="editTenantsModal">
            <Modal.Header>
                <Icon name="user" /> {t('editTenantsModalHeader', { username: user.username })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        {/* TODO Norbert: Provide label */}
                        <Form.Dropdown
                            placeholder={t('details.tenants')}
                            multiple
                            selection
                            options={options}
                            name="tenants"
                            value={Object.keys(editedTenants)}
                            onChange={handleInputChange}
                        />
                    </Form.Field>
                    <RolesPicker
                        onUpdate={onRoleChange}
                        resources={editedTenants}
                        resourceName="tenant"
                        toolbox={toolbox}
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={submitTenant} disabled={isLoading} icon="user" />
            </Modal.Actions>
        </Modal>
    );
};

export default TenantModal;
