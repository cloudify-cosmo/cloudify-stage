import { noop } from 'lodash';
import type { Toolbox } from 'app/utils/StageAPI';
import type { DropdownProps } from 'semantic-ui-react';
import type { RolesPickerProps } from 'app/widgets/common/roles/RolesPicker';
import type { Tenant } from './widget.types';
import Actions from './actions';

const RolesPicker = Stage.Common.Roles.Picker;
const { getDefaultRoleName } = Stage.Common.Roles.Utils;

const translate = Stage.Utils.getT('widgets.tenants.usersModal');

export default function UsersModal({
    onHide = noop,
    tenant,
    open,
    toolbox,
    users
}: {
    onHide: () => void;
    tenant: Tenant;
    open?: boolean;
    toolbox: Toolbox;
    users?: string[];
}) {
    const { useBoolean, useErrors, useInput, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [editedUsers, setEditedUsers] = useInput<Record<string, string>>({});

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

    const onRoleChange: RolesPickerProps['onUpdate'] = (user, role) => {
        const newUsers = { ...editedUsers };
        newUsers[user] = role;
        setEditedUsers(newUsers);
    };

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

    const handleInputChange: DropdownProps['onChange'] = (_proxy, field) => {
        const newUsers: Record<string, string> = {};
        _.forEach(field.value as string[], user => {
            newUsers[user] = editedUsers[user] || getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedUsers(newUsers);
    };

    const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" /> {translate('header', tenant)}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={translate('form.users.label')}>
                        <Form.Dropdown
                            multiple
                            selection
                            options={_.map(users, user => {
                                return { text: user, value: user, key: user };
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
                <ApproveButton
                    onClick={updateTenant}
                    disabled={isLoading}
                    content={translate('actions.save')}
                    icon="user"
                />
            </Modal.Actions>
        </Modal>
    );
}
