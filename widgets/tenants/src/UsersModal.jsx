/**
 * Created by jakubniezgoda on 01/02/2017.
 */

import Actions from './actions';
import TenantPropType from './props/TenantPropType';

const { RolesPicker } = Stage.Common;
const { RolesUtil } = Stage.Common;

export default function UsersModal({ onHide, tenant, open, toolbox, users }) {
    const { useBoolean, useErrors, useInput, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [editedUsers, setEditedUsers] = useInput({});

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        setEditedUsers(
            _.mapValues(
                _.pickBy(tenant.users, rolesObj => {
                    return !_.isEmpty(rolesObj['tenant-role']);
                }),
                rolesObj => {
                    return rolesObj['tenant-role'];
                }
            )
        );
    });

    function onRoleChange(user, role) {
        const newUsers = { ...editedUsers };
        newUsers[user] = role;
        setEditedUsers(newUsers);
    }

    function updateTenant() {
        // Disable the form
        setLoading();

        const roles = tenant.user_roles.direct;
        const usersList = Object.keys(roles);
        const submitUsersList = Object.keys(editedUsers);

        const usersToAdd = _.pick(editedUsers, _.difference(submitUsersList, usersList));
        const usersToRemove = _.difference(usersList, submitUsersList);
        const usersToUpdate = _.pickBy(editedUsers, (role, user) => {
            return roles[user] && !_.isEqual(roles[user], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleUsers(tenant.name, usersToAdd, usersToRemove, usersToUpdate)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function handleInputChange(proxy, field) {
        const newUsers = {};
        _.forEach(field.value, user => {
            newUsers[user] = editedUsers[user] || RolesUtil.getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedUsers(newUsers);
    }

    const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" /> Edit users for tenant {tenant.name}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Users"
                            multiple
                            selection
                            options={_.map(users.items, user => {
                                return { text: user.username, value: user.username, key: user.username };
                            })}
                            name="users"
                            value={Object.keys(editedUsers)}
                            onChange={handleInputChange}
                        />
                    </Form.Field>
                    <RolesPicker
                        onUpdate={onRoleChange}
                        resources={editedUsers}
                        resourceName="user"
                        toolbox={toolbox}
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={updateTenant} disabled={isLoading} content="Save" icon="user" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

UsersModal.propTypes = {
    tenant: TenantPropType.isRequired,
    users: PropTypes.shape({ items: PropTypes.array }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    onHide: PropTypes.func,
    open: PropTypes.bool.isRequired
};

UsersModal.defaultProps = {
    onHide: () => {}
};
