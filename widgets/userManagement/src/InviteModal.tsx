import type { FunctionComponent } from 'react';
import getWidgetT from './getWidgetT';
import AuthServiceActions from './authServiceActions';

const tModal = (key: string) => getWidgetT()(`inviteModal.${key}`);

interface InviteModalProps {
    toolbox: Stage.Types.Toolbox;
}

interface InviteModalInputs {
    email: string;
}

const InviteModal: FunctionComponent<InviteModalProps> = ({ toolbox }) => {
    const { useOpen, useErrors, useBoolean, useInputs } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const [inputs, setInput, clearInputs] = useInputs<InviteModalInputs>({
        email: ''
    });
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();

    const [isOpen, openModal, closeModal] = useOpen(() => {
        clearInputs();
        clearErrors();
    });

    function submitInvite() {
        const submitErrors: Partial<Record<keyof InviteModalInputs, string>> = {};
        clearErrors();

        if (!inputs.email || !Stage.Common.Consts.emailRegex.test(inputs.email)) {
            submitErrors.email = tModal('inputs.email.error');
            setErrors(submitErrors);
            return;
        }

        // Disable the form
        setLoading();

        const authServiceActions = new AuthServiceActions(toolbox);

        authServiceActions.doInvite(inputs.email).then(closeModal).catch(setMessageAsError).finally(unsetLoading);
    }

    const { ApproveButton, Button, CancelButton, Icon, Form, Modal } = Stage.Basic;

    const inviteButton = <Button content={tModal('button')} icon="add user" labelPosition="left" />;

    return (
        <Modal trigger={inviteButton} open={isOpen} onOpen={openModal} onClose={closeModal}>
            <Modal.Header>
                <Icon name="add user" /> {tModal('header')}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label={tModal('inputs.email.label')} error={errors.email} required>
                        <Form.Input name="email" value={inputs.email} onChange={setInput} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={closeModal} disabled={isLoading} />
                <ApproveButton onClick={submitInvite} disabled={isLoading} content={tModal('button')} icon="add user" />
            </Modal.Actions>
        </Modal>
    );
};
export default InviteModal;
