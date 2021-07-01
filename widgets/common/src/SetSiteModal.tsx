// @ts-nocheck File not migrated fully to TS
export {};

function SetSiteModal({ deploymentId, deploymentName, onHide, open, toolbox }) {
    const {
        Basic: { Modal, Icon, Form, ApproveButton, CancelButton },
        Common: { DeploymentActions },
        Hooks: { useBoolean, useErrors, useInput, useOpenProp, useResettableState },
        i18n
    } = Stage;

    const [detachSite, setDetachSite, clearDetachSite] = useInput(false);
    const { errors, clearErrors, setMessageAsError } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean();
    const [siteName, setSiteName, clearSiteName] = useInput('');
    const [sites, setSites, resetSites] = useResettableState({ items: [] });

    const siteOptions = _.map(sites.items, site => {
        return { text: site.name, value: site.name };
    });

    useOpenProp(open, () => {
        const actions = new DeploymentActions(toolbox);

        setLoading();
        clearDetachSite();
        clearSiteName();
        clearErrors();
        resetSites();

        Promise.all([actions.doGetSitesNames(), actions.doGetSiteName(deploymentId)])
            .then(([fetchedSites, fetchedSiteName]) => {
                setSites(fetchedSites);
                setSiteName(fetchedSiteName);
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    });

    function setSite() {
        setLoading();

        const actions = new DeploymentActions(toolbox);
        actions
            .doSetSite(deploymentId, siteName, detachSite)
            .then(() => {
                // State updates should be done before calling `onHide` to avoid React errors:
                // "Warning: Can't perform a React state update on an unmounted component"
                clearErrors();
                toolbox.getEventBus().trigger('deployments:refresh');
                unsetLoading();
                onHide();
            })
            .catch(error => {
                setMessageAsError(error);
                unsetLoading();
            });
    }

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="edit" />
                {i18n.t(`widgets.common.deployments.setSiteModal.header`, { deploymentId, deploymentName })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={loading} errors={errors} onErrorsDismiss={clearErrors}>
                    <Form.Field
                        error={errors.siteName}
                        label={i18n.t('widgets.common.deployments.setSiteModal.siteNameLabel')}
                    >
                        <Form.Dropdown
                            search
                            selection
                            value={siteName}
                            name="siteName"
                            options={siteOptions}
                            onChange={(event, field) => setSiteName(field.value)}
                        />
                    </Form.Field>
                    <Form.Field className="detachSite">
                        <Form.Checkbox
                            toggle
                            label={i18n.t('widgets.common.deployments.setSiteModal.detachSiteLabel')}
                            name="detachSite"
                            checked={detachSite}
                            onChange={(event, field) => setDetachSite(field.checked)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={loading} />
                <ApproveButton
                    onClick={setSite}
                    disabled={loading}
                    content={i18n.t('widgets.common.deployments.setSiteModal.updateButton')}
                    icon="edit"
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

SetSiteModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    deploymentName: PropTypes.string.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};

Stage.defineCommon({
    name: 'SetSiteModal',
    common: SetSiteModal
});
