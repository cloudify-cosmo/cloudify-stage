// @ts-nocheck File not migrated fully to TS

import Actions from './actions';
import GroupPropType from './props/GroupPropType';

const { RolesPicker, RolesUtil } = Stage.Common;
const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
const t = Stage.Utils.getT('widgets.userGroups.modals.tenants');

export default function TenantsModal({ group, open, tenants, toolbox, onHide }) {
    const { useState } = React;
    const { useBoolean, useErrors, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedTenants, setEditedTenants] = useState({});
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

    function onRoleChange(tenant, role) {
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

        const tenantsToAdd = _.pick(editedTenants, _.difference(submitTenantsList, tenantsList));
        const tenantsToRemove = _.difference(tenantsList, submitTenantsList);
        const tenantsToUpdate = _.pickBy(editedTenants, (role, tenant) => {
            return groupTenants[tenant] && !_.isEqual(groupTenants[tenant], role);
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

    function handleInputChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] = editedTenants[tenant] || RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedTenants(newTenants);
    }

    const options = _.map(tenants.items, item => {
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
                <ApproveButton onClick={submitTenants} disabled={isLoading} icon="user" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

TenantsModal.propTypes = {
    group: GroupPropType.isRequired,
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tenants: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.object) }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
