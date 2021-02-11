function SetSiteModal({ deploymentId, onHide, open, toolbox }) {
    const {
        Basic: { Modal, Icon, Form, ApproveButton, CancelButton },
        Common: { DeploymentActions },
        Hooks: { useBoolean, useErrors, useInput, useOpenProp, useResettableState },
        i18n
    } = Stage;

    const [detachSite, setDetachSite, clearDetachSite] = useInput(false);
    const { errors, clearErrors, setMessageAsError } = useErrors();
    const [loading, setLoading, unsetLoading] = useBoolean(false);
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

        actions
            .doGetSites()
            .then(setSites)
            .then(() => actions.doGetSite(deploymentId))
            .then(setSiteName)
            .catch(setMessageAsError)
            .finally(unsetLoading);
    });

    function setSite() {
        setLoading();

        const actions = new DeploymentActions(toolbox);
        actions
            .doSetSite(deploymentId, siteName, detachSite)
            .then(() => {
                clearErrors();
                toolbox.getEventBus().trigger('deployments:refresh');
                onHide();
            })
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    return (
        <div>
            <Modal open={open} onClose={onHide}>
                <Modal.Header>
                    <Icon name="edit" />
                    {i18n.t(`widgets.common.deployments.setSiteModal.header`, { deploymentId })}
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
        </div>
    );
}

/**
 * @property {string} deploymentId Deployment ID
 * @property {object} toolbox Toolbox object
 * @property {Function} onHide function to be called when the modal is closed
 * @property {boolean} open specifies whether the update modal is displayed
 */
SetSiteModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired
};

Stage.defineCommon({
    name: 'SetSiteModal',
    common: SetSiteModal
});
