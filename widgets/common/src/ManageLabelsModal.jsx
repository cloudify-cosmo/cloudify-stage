function ManageLabelsModal({ deploymentId, existingLabels, header, open, onHide, toolbox }) {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;
    const { DeploymentActions, LabelsInput } = Stage.Common;
    const { useBoolean, useErrors, useOpenProp, useResettableState } = Stage.Hooks;
    const actions = new DeploymentActions(toolbox);

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, clearErrors, setErrors, setMessageAsError } = useErrors();
    const [labels, setLabels, resetLabels] = useResettableState([]);
    const [initialLabels, setInitialLabels, resetInitialLabels] = useResettableState(existingLabels || []);

    useOpenProp(open, () => {
        clearErrors();
        resetLabels();
        resetInitialLabels();

        if (!existingLabels) {
            setLoading();
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
        }
    });

    function onChange(newLabels) {
        clearErrors();
        setLabels(newLabels);
    }

    function onApply() {
        clearErrors();
        setLoading();

        actions
            .doSetLabels(deploymentId, [...existingLabels, ...labels])
            .then(onHide)
            .catch(setMessageAsError)
            .finally(unsetLoading);
    }

    return (
        <Modal open={open} onClose={onHide}>
            <Modal.Header>
                <Icon name="tags" /> {header || i18n.t('widgets.common.labels.modalHeader', { deploymentId })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={i18n.t('widgets.common.labels.inputName')}
                        help={i18n.t('widgets.common.labels.inputHelp')}
                    >
                        <LabelsInput
                            addMode={!!existingLabels}
                            initialLabels={initialLabels}
                            onChange={onChange}
                            toolbox={toolbox}
                        />
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
    existingLabels: PropTypes.arrayOf(),
    header: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

ManageLabelsModal.defaultProps = {
    existingLabels: null,
    header: null
};

Stage.defineCommon({
    name: 'ManageLabelsModal',
    common: ManageLabelsModal
});
