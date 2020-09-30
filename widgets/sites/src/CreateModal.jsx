import SiteActions from './SiteActions';
import SiteLocationInput from './SiteLocationInput';

export default function CreateModal({ toolbox }) {
    const { useBoolean, useErrors, useOpen, useInputs, useInput } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors, setErrors } = useErrors();
    const [siteVisibility, setSiteVisibility, clearSiteVisibility] = useInput(Stage.Common.Consts.defaultVisibility);
    const [inputs, setInput, clearInputs] = useInputs({
        siteName: '',
        siteLocation: ''
    });
    const [isOpen, doOpen, doClose] = useOpen(() => {
        unsetLoading();
        clearErrors();
        clearInputs();
        clearSiteVisibility();
    });

    function createSite() {
        const { siteName, siteLocation } = inputs;
        if (_.isEmpty(siteName)) {
            setErrors({ siteName: 'Please provide site name' });
            return;
        }

        // Disable the form
        setLoading();

        const actions = new SiteActions(toolbox);
        actions
            .doCreate(siteName, siteVisibility, siteLocation)
            .then(() => {
                clearErrors();
                doClose();
                toolbox.refresh();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const { siteName } = inputs;
    const { ApproveButton, Button, CancelButton, Icon, Form, Modal, VisibilityField } = Stage.Basic;
    const createButton = <Button content="Create" icon="add" labelPosition="left" />;

    return (
        <Modal trigger={createButton} open={isOpen} onOpen={doOpen} onClose={doClose}>
            <Modal.Header>
                <Icon name="add" /> Create site
                <VisibilityField
                    visibility={siteVisibility}
                    className="rightFloated"
                    onVisibilityChange={setSiteVisibility}
                />
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field label="Name" error={errors.siteName} required>
                        <Form.Input name="siteName" value={siteName} onChange={setInput} />
                    </Form.Field>
                    <Form.Field error={errors.siteLocation}>
                        <SiteLocationInput onChange={setInput} toolbox={toolbox} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={doClose} disabled={isLoading} />
                <ApproveButton onClick={createSite} disabled={isLoading} content="Create" icon="add" color="green" />
            </Modal.Actions>
        </Modal>
    );
}

CreateModal.propTypes = {
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
