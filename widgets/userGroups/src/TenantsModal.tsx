import { pick, pickBy, difference, isEqual, map, forEach } from 'lodash';
import type { DropdownProps } from 'semantic-ui-react';
import type { UserGroup } from './widget.types';
import type { Role } from '../../../app/widgets/common/roles/RolesPicker';
import type { RolesAssignment } from '../../../app/widgets/common/tenants/utils';
import Actions from './actions';

const RolesPicker = Stage.Common.Roles.Picker;
const { getDefaultRoleName } = Stage.Common.Roles.Utils;
const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
const t = Stage.Utils.getT('widgets.userGroups.modals.tenants');

interface TenantsModalProps {
    group: UserGroup;
    onHide: () => void;
    open: boolean;
    tenants: Record<string, any>;
    toolbox: Stage.Types.Toolbox;
}

export default function TenantsModal({ group, open, tenants, toolbox, onHide }: TenantsModalProps) {
    const { useState } = React;
    const { useBoolean, useErrors, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedTenants, setEditedTenants] = useState<RolesAssignment>({});
    const { errors, setMessageAsError, clearErrors } = useErrors();

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        setEditedTenants(group.tenants);
    });

    function onCancel() {
        onHide();
        return true;
    }

    function onRoleChange(tenant: string, role: Role) {
        const newTenants = { ...editedTenants };
        newTenants[tenant] = role;
        setEditedTenants(newTenants);
    }

    function submitTenants() {
        // Disable the form
        setLoading();

        const { tenants: groupTenants } = group;
        const tenantsList = Object.keys(groupTenants);
        const submitTenantsList = Object.keys(editedTenants);

        const tenantsToAdd = pick(editedTenants, difference(submitTenantsList, tenantsList));
        const tenantsToRemove = difference(tenantsList, submitTenantsList);
        const tenantsToUpdate = pickBy(editedTenants, (role, tenant) => {
            return groupTenants[tenant] && !isEqual(groupTenants[tenant], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleTenants(group.name, tenantsToAdd, tenantsToRemove, tenantsToUpdate)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('tenants:refresh');
                toolbox.getEventBus().trigger('users:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const handleInputChange: DropdownProps['onChange'] = (_proxy: any, field) => {
        const newTenants: RolesAssignment = {};
        forEach(field.value as string, tenant => {
            newTenants[tenant] = editedTenants[tenant] || getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedTenants(newTenants);
    };
    const options = map(tenants.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" />
                {t('header', {
                    groupName: group.name
                })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={t('fields.tenants')}>
                        <Form.Dropdown
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
                <CancelButton onClick={onCancel} disabled={isLoading} />
                <ApproveButton onClick={submitTenants} disabled={isLoading} icon="user" />
            </Modal.Actions>
        </Modal>
    );
}
