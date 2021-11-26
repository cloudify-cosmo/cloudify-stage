// @ts-nocheck File not migrated fully to TS

import Actions from './actions';

const { UnsafelyTypedFormField } = Stage.Basic;

export default function CreateModal({ toolbox, isLdapEnabled }) {
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
                    <UnsafelyTypedFormField error={errors.groupName} label="Group name">
                        <Form.Input name="groupName" value={groupName} onChange={setInput} />
                    </UnsafelyTypedFormField>

                    {isLdapEnabled && (
                        <UnsafelyTypedFormField error={errors.ldapGroup} label="LDAP group name">
                            <Form.Input name="ldapGroup" value={ldapGroup} onChange={setInput} />
                        </UnsafelyTypedFormField>
                    )}

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
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    isLdapEnabled: PropTypes.bool
};
