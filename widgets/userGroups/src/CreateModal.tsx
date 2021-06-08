/**
 * Created by jakubniezgoda on 03/02/2017.
 */

import Actions from './actions';

export default function CreateModal({ toolbox }) {
    const { useBoolean, useErrors, useOpen, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [inputs, setInput, clearInputs] = useInputs({ groupName: '', ldapGroup: '', isAdmin: false });
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearInputs();
        clearErrors();
    });

    function submitCreate() {
        const { groupName, isAdmin, ldapGroup } = inputs;

        if (_.isEmpty(groupName)) {
            setErrors({ groupName: 'Please provide group name' });
            return;
        }

        // Disable the form
        setLoading();

        const actions = new Actions(toolbox);
        actions
            .doCreate(groupName, ldapGroup, Stage.Common.RolesUtil.getSystemRole(isAdmin))
            .then(() => {
                clearErrors();
                doClose();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const { groupName, isAdmin, ldapGroup } = inputs;
    const { Modal, Button, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;
    const addButton = <Button content="Add" icon="add user" labelPosition="left" />;

    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add user" /> Add user group
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.groupName}>
                        <Form.Input name="groupName" placeholder="Group name" value={groupName} onChange={setInput} />
                    </Form.Field>

                    <Form.Field error={errors.ldapGroup}>
                        <Form.Input
                            name="ldapGroup"
                            placeholder="LDAP group name"
                            value={ldapGroup}
                            onChange={setInput}
                        />
                    </Form.Field>

                    <Form.Field error={errors.isAdmin}>
                        <Form.Checkbox label="Admin" name="isAdmin" checked={isAdmin} onChange={setInput} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={submitCreate}
                    disabled={isLoading}
                    content="Add"
                    icon="add user"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

CreateModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
