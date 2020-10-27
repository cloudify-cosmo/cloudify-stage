/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';
import UserPropType from './props/UserPropType';

const { RolesPicker } = Stage.Common;
const { RolesUtil } = Stage.Common;

export default function TenantModal({ onHide, open, user, toolbox, tenants }) {
    const { useBoolean, useErrors, useOpenProp, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedTenants, setEditedTenants] = useInput({});
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

    function onRoleChange(tenant, role) {
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

        const tenantsToAdd = _.pick(editedTenants, _.difference(submitTenantsList, tenantsList));
        const tenantsToRemove = _.difference(tenantsList, submitTenantsList);
        const tenantsToUpdate = _.pickBy(editedTenants, (role, tenant) => {
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

    function handleInputChange(proxy, field) {
        const newTenants = {};
        _.forEach(field.value, tenant => {
            newTenants[tenant] = editedTenants[tenant] || RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedTenants(newTenants);
    }

    const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

    const options = _.map(tenants.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Modal open={open} onClose={() => onHide()} className="editTenantsModal">
            <Modal.Header>
                <Icon name="user" /> Edit tenants for {user.username}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Tenants"
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
                <ApproveButton onClick={submitTenant} disabled={isLoading} icon="user" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

TenantModal.propTypes = {
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    tenants: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string }))
    }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    user: UserPropType.isRequired
};
