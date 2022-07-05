// @ts-nocheck File not migrated fully to TS

import { useEffect } from 'react';
import Actions from './actions';
import TenantPropType from './props/TenantPropType';

const RolesPicker = Stage.Common.Roles.Picker;
const { getDefaultRoleName } = Stage.Common.Roles.Utils;
const { useBoolean, useErrors, useInput, useOpenProp } = Stage.Hooks;
const { Modal, Icon, Form, CancelButton, ApproveButton } = Stage.Basic;

export default function GroupsModal({ onHide, open, tenant, toolbox, userGroups }) {
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [editedUserGroups, setEditedUserGroups] = useInput({});

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        setEditedUserGroups(tenant.groups);
    });

    function onRoleChange(group, role) {
        const newUserGroups = { ...editedUserGroups };
        newUserGroups[group] = role;
        setEditedUserGroups(newUserGroups);
    }

    function updateTenant() {
        // Disable the form
        setLoading();

        const userGroupsList = Object.keys(tenant.groups);
        const submitUserGroupsList = Object.keys(editedUserGroups);

        const userGroupsToAdd = _.pick(editedUserGroups, _.difference(submitUserGroupsList, userGroupsList));
        const userGroupsToRemove = _.difference(userGroupsList, submitUserGroupsList);
        const userGroupsToUpdate = _.pickBy(editedUserGroups, (role, group) => {
            return tenant.groups[group] && !_.isEqual(tenant.groups[group], role);
        });

        const actions = new Actions(toolbox);
        actions
            .doHandleUserGroups(tenant.name, userGroupsToAdd, userGroupsToRemove, userGroupsToUpdate)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('userGroups:refresh');
                toolbox.getEventBus().trigger('users:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    function handleInputChange(proxy, field) {
        const newUserGroups = {};
        _.forEach(field.value, group => {
            newUserGroups[group] = editedUserGroups[group] || getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedUserGroups(newUserGroups);
    }

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="users" /> Edit user groups for {tenant.name}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label="Groups">
                        <Form.Dropdown
                            multiple
                            selection
                            options={_.map(userGroups.items, userGroup => {
                                return { text: userGroup.name, value: userGroup.name, key: userGroup.name };
                            })}
                            name="userGroups"
                            value={Object.keys(editedUserGroups)}
                            onChange={handleInputChange}
                        />
                    </Form.Field>
                    <RolesPicker
                        onUpdate={onRoleChange}
                        resources={editedUserGroups}
                        resourceName="user group"
                        toolbox={toolbox}
                    />
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={updateTenant} disabled={isLoading} icon="users" />
            </Modal.Actions>
        </Modal>
    );
}

GroupsModal.propTypes = {
    tenant: TenantPropType.isRequired,
    userGroups: PropTypes.shape({ items: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })) }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    onHide: PropTypes.func,
    open: PropTypes.bool.isRequired
};

GroupsModal.defaultProps = {
    onHide: _.noop
};
