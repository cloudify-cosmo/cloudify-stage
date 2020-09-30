/**
 * Created by pposel on 31/01/2017.
 */

import Actions from './actions';
import UserPropType from './props/UserPropType';

export default function GroupModal({ onHide, open, user, toolbox, groups }) {
    const { useBoolean, useErrors, useOpenProp, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedGroups, setEditedGroups] = useInput([]);
    const { errors, setMessageAsError, clearErrors } = useErrors();

    useOpenProp(open, () => {
        unsetLoading();
        setEditedGroups(user.groups);
        clearErrors();
    });

    function onCancel() {
        onHide();
        return true;
    }

    function submitGroup() {
        // Disable the form
        setLoading();

        const groupsToAdd = _.difference(editedGroups, user.groups);
        const groupsToRemove = _.difference(user.groups, editedGroups);

        const actions = new Actions(toolbox);
        actions
            .doHandleGroups(user.username, groupsToAdd, groupsToRemove)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                toolbox.getEventBus().trigger('userGroups:refresh');
                toolbox.getEventBus().trigger('tenants:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

    const options = _.map(groups.items, item => {
        return { text: item.name, value: item.name, key: item.name };
    });

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" /> Edit user groups for {user.username}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field>
                        <Form.Dropdown
                            placeholder="Groups"
                            multiple
                            selection
                            options={options}
                            name="groups"
                            value={editedGroups}
                            onChange={setEditedGroups}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onCancel} disabled={isLoading} />
                <ApproveButton onClick={submitGroup} disabled={isLoading} icon="user" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

GroupModal.propTypes = {
    groups: PropTypes.shape({ items: PropTypes.array }).isRequired,
    onHide: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    user: UserPropType.isRequired
};
