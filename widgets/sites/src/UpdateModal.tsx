import SiteActions from './SiteActions';
import SiteLocationInput from './SiteLocationInput';
import type { SiteLocationInputProps } from './SiteLocationInput';
import type { Site } from './widget.types';

const { Modal, Icon, Form, ApproveButton, CancelButton } = Stage.Basic;

interface UpdateModalProps {
    onHide: () => void;
    open: boolean;
    site: Site;
    toolbox: Stage.Types.Toolbox;
}

export default function UpdateModal({ onHide, open, site, toolbox }: UpdateModalProps) {
    const { useBoolean, useErrors, useInput, useOpenProp } = Stage.Hooks;

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, setMessageAsError, clearErrors } = useErrors();
    const [siteNewName, setSiteNewName] = useInput('');
    const [siteLocation, setSiteLocation] = useInput('');

    useOpenProp(open, () => {
        unsetLoading();
        clearErrors();
        setSiteNewName(site.name);
        setSiteLocation(site.location || '');
    });

    function updateSite() {
        // Disable the form
        setLoading();

        const actions = new SiteActions(toolbox);
        actions
            .doUpdate(site.name, null, siteLocation, siteNewName)
            .then(() => {
                clearErrors();
                toolbox.refresh();
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    const handleSiteLocationInputChange: SiteLocationInputProps['onChange'] = (_event, field) => {
        setSiteLocation(field.value);
    };

    return (
        <div>
            <Modal open={open} onClose={onHide}>
                <Modal.Header>
                    <Icon name="edit" /> Update site {site.name}
                </Modal.Header>

                <Modal.Content>
                    <Form loading={isLoading} errors={errors} onErrorsDismiss={clearErrors}>
                        <Form.Field error={errors.siteNewName}>
                            <Form.Input label="Name" name="siteNewName" value={siteNewName} onChange={setSiteNewName} />
                        </Form.Field>
                        <Form.Field error={errors.siteLocation}>
                            <SiteLocationInput
                                value={siteLocation}
                                onChange={handleSiteLocationInputChange}
                                toolbox={toolbox}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={onHide} disabled={isLoading} />
                    <ApproveButton onClick={updateSite} disabled={isLoading} content="Update" icon="edit" />
                </Modal.Actions>
            </Modal>
        </div>
    );
}
