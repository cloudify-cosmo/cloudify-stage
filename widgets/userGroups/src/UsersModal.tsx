/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';
import GroupPropType from './props/GroupPropType';

export default function UsersModal({ onHide, group, groups, open, toolbox, users }) {
    const { useState } = React;
    const { useBoolean, useErrors, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedUsers, setEditedUsers] = useState([]);
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
        const usersToAdd = _.difference(editedUsers, group.users);
        const usersToRemove = _.difference(group.users, editedUsers);

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

    function handleInputChange(proxy, { value }) {
        setEditedUsers(value);
        setWaitingForConfirmation(false);
    }

    const { ApproveButton, CancelButton, Form, Icon, Message, Modal } = Stage.Basic;

    const options = _.map(users.items, item => {
        return { text: item.username, value: item.username, key: item.username };
    });

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" /> Edit users for {group.name}
            </Modal.Header>

            <Modal.Content>
                {waitingForConfirmation && (
                    <Message warning onDismiss={() => setWaitingForConfirmation(false)}>
                        <Message.Header>Confirmation request</Message.Header>
                        You are about to remove yourself from this group. Your administrative privileges will be removed
                        and you will be logged out of the system so the changes take effect. Are you sure you want to
                        continue?
                    </Message>
                )}
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Users"
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
                    content={waitingForConfirmation ? 'No' : undefined}
                />
                <ApproveButton
                    onClick={submitUsers}
                    disabled={isLoading}
                    icon="user"
                    color="green"
                    content={waitingForConfirmation ? 'Yes' : undefined}
                />
            </Modal.Actions>
        </Modal>
    );
}

UsersModal.propTypes = {
    group: GroupPropType.isRequired,
    groups: PropTypes.arrayOf(GroupPropType).isRequired,
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    users: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.object)
    }).isRequired
};
