function ManageLabelsModal({ deploymentId, open, onHide, toolbox }) {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;
    const { DeploymentActions, LabelsInput } = Stage.Common;
    const { useBoolean, useErrors, useOpenProp, useResettableState } = Stage.Hooks;
    const actions = new DeploymentActions(toolbox);

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, clearErrors, setErrors, setMessageAsError } = useErrors();
    const [labels, setLabels, resetLabels] = useResettableState([]);
    const [initialLabels, setInitialLabels, resetInitialLabels] = useResettableState([]);

    useOpenProp(open, () => {
        clearErrors();
        setLoading();
        resetLabels();
        resetInitialLabels();

        actions
            .doGetLabels(deploymentId)
            .then(deploymentLabels => {
                setLabels(deploymentLabels);
                setInitialLabels(deploymentLabels);
            })
            .catch(error => {
                log.error(error);
                setErrors(i18n.t('widgets.common.labels.fetchingLabelsError', { deploymentId }));
            })
            .finally(unsetLoading);
    });

    function onChange(newLabels) {
        clearErrors();
        setLabels(newLabels);
    }

    function onApply() {
        clearErrors();
        setLoading();

        actions
            .doSetLabels(deploymentId, labels)
            .then(() => {
                unsetLoading();
                onHide();
            })
            .catch(error => {
                unsetLoading();
                setMessageAsError(error);
            });
    }

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="tags" /> {i18n.t('widgets.common.labels.modalHeader', { deploymentId })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={i18n.t('widgets.common.labels.inputName')}
                        help={i18n.t('widgets.common.labels.inputHelp')}
                    >
                        <LabelsInput initialLabels={initialLabels} onChange={onChange} toolbox={toolbox} />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton
                    onClick={onApply}
                    disabled={isLoading}
                    content={i18n.t('widgets.common.labels.modalApplyButton')}
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

ManageLabelsModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'ManageLabelsModal',
    common: ManageLabelsModal
});
