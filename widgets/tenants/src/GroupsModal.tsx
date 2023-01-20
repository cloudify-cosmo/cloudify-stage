import { noop } from 'lodash';
import type { Toolbox } from 'app/utils/StageAPI';
import type { DropdownProps } from 'semantic-ui-react';
import type { Tenant } from './widget.types';
import Actions from './actions';

const RolesPicker = Stage.Common.Roles.Picker;
const { getDefaultRoleName } = Stage.Common.Roles.Utils;
const { useBoolean, useErrors, useInput, useOpenProp } = Stage.Hooks;
const { Modal, Icon, Form, CancelButton, ApproveButton } = Stage.Basic;

interface GroupsModalProps {
    onHide: () => void;
    open?: boolean;
    tenant: Tenant;
    toolbox: Toolbox;
    userGroups?: string[];
}

export default function GroupsModal({ onHide = noop, open, tenant, toolbox, userGroups }: GroupsModalProps) {
    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [editedUserGroups, setEditedUserGroups] = useInput<Record<string, string>>({});

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        setEditedUserGroups(tenant.groups);
    });

    function onRoleChange(group: string, role: string) {
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

    const handleInputChange: DropdownProps['onChange'] = (_proxy, field) => {
        const newUserGroups: Record<string, string> = {};
        _.forEach(field.value as string[], group => {
            newUserGroups[group] = editedUserGroups[group] || getDefaultRoleName(toolbox.getManagerState().roles);
        });
        setEditedUserGroups(newUserGroups);
    };

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
                            options={_.map(userGroups, userGroup => {
                                return { text: userGroup, value: userGroup, key: userGroup };
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
