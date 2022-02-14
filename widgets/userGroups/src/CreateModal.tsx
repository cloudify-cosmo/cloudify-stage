// @ts-nocheck File not migrated fully to TS

import Actions from './actions';

const t = Stage.Utils.getT('widgets.userGroups.modals.create');

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
            const validationMessage = t('validation.groupName');
            setErrors({ groupName: validationMessage });
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
    const addButton = <Button content={t('buttons.add')} icon="add user" labelPosition="left" />;

    return (
        <Modal trigger={addButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add user" />
                {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field error={errors.groupName} label={t('fields.groupName')}>
                        <Form.Input name="groupName" value={groupName} onChange={setInput} />
                    </Form.Field>

                    {isLdapEnabled && (
                        <Form.Field error={errors.ldapGroup} label={t('fields.ldapGroup')}>
                            <Form.Input name="ldapGroup" value={ldapGroup} onChange={setInput} />
                        </Form.Field>
                    )}

                    <Form.Field error={errors.isAdmin}>
                        <Form.Checkbox label={t('fields.admin')} name="isAdmin" checked={isAdmin} onChange={setInput} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton
                    onClick={submitCreate}
                    disabled={isLoading}
                    content={t('buttons.add')}
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
