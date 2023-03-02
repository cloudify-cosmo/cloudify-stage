import type { FunctionComponent } from 'react';
import Actions from './actions';
import type { User } from './widget.types';
import getWidgetT from './getWidgetT';

const t = getWidgetT();

interface GroupModalProps {
    groups: string[];
    onHide: () => void;
    open: boolean;
    toolbox: Stage.Types.Toolbox;
    user: User;
}

const GroupModal: FunctionComponent<GroupModalProps> = ({ onHide, open, user, toolbox, groups }) => {
    const { useBoolean, useErrors, useOpenProp, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [editedGroups, setEditedGroups] = useInput<string[]>([]);
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

    const options = _.map(groups, group => {
        return { text: group, value: group, key: group };
    });

    return (
        <Modal open={open} onClose={() => onHide()}>
            <Modal.Header>
                <Icon name="user" /> {t('editGroupsModalHeader', { username: user.username })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={t('details.groups')}>
                        <Form.Dropdown
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
                <ApproveButton onClick={submitGroup} disabled={isLoading} icon="user" />
            </Modal.Actions>
        </Modal>
    );
};

export default GroupModal;
