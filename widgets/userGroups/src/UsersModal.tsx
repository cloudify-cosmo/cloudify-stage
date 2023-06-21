import { difference, map } from 'lodash';
import type { DropdownProps } from 'semantic-ui-react';
import type { UserGroup } from './widget.types';
import Actions from './actions';

const translate = Stage.Utils.getT('widgets.userGroups.modals.user');

export interface Users {
    items?: {
        username: string;
    }[];
}

interface UsersModalProps {
    group: UserGroup;
    groups: UserGroup[];
    onHide: () => void;
    open: boolean;
    toolbox: Stage.Types.Toolbox;
    users: Users;
}

export default function UsersModal({ onHide, group, groups, open, toolbox, users }: UsersModalProps) {
    const { useState } = React;
    const { useBoolean, useErrors, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedUsers, setEditedUsers] = useState<UserGroup['users']>([]);
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);

    useOpenProp(open, () => {
        unsetLoading();
        setEditedUsers(group.users);
        clearErrors();
        setWaitingForConfirmation(false);
    });

    function onCancel() {
        onHide();
        return true;
    }

    function submitUsers() {
        const actions = new Actions(toolbox);
        const usersToAdd = difference(editedUsers, group.users);
        const usersToRemove = difference(group.users, editedUsers);

        if (!waitingForConfirmation && actions.isLogoutToBePerformed(group, groups, usersToRemove)) {
            setWaitingForConfirmation(true);
            return;
        }

        // Disable the form
        setLoading();

        actions
            .doHandleUsers(group.name, usersToAdd, usersToRemove)
            .then(() => {
                if (waitingForConfirmation) {
                    toolbox.getEventBus().trigger('menu.users:logout');
                }
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('users:refresh');
                toolbox.getEventBus().trigger('tenants:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const handleInputChange: DropdownProps['onChange'] = (_event, { value }) => {
        setEditedUsers(value as UserGroup['users']);
        setWaitingForConfirmation(false);
    };

    const { ApproveButton, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;

    const options = map(users.items, item => {
        return { text: item.username, value: item.username, key: item.username };
    });

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" />
                {translate('header', {
                    groupName: group.name
                })}
            </Modal.Header>

            <Modal.Content>
                {waitingForConfirmation && (
                    <Message warning onDismiss={() => setWaitingForConfirmation(false)}>
                        <Message.Header>{translate('message.header')}</Message.Header>
                        {translate('message.content')}
                    </Message>
                )}
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={translate('fields.users')}>
                        <Form.Dropdown
                            multiple
                            selection
                            options={options}
                            name="users"
                            value={editedUsers}
                            onChange={handleInputChange}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton
                    onClick={onCancel}
                    disabled={isLoading}
                    content={waitingForConfirmation ? translate('buttons.cancel') : undefined}
                />
                <ApproveButton
                    onClick={submitUsers}
                    disabled={isLoading}
                    icon="user"
                    content={waitingForConfirmation ? translate('buttons.approve') : undefined}
                />
            </Modal.Actions>
        </Modal>
    );
}
