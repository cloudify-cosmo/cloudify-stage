import LabelsInput from './Input';

export default function ManageModal({
    deploymentId,
    existingLabels,
    header,
    applyButtonContent,
    open,
    onHide,
    toolbox
}) {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Form, Icon, Modal } = Stage.Basic;
    const { DeploymentActions } = Stage.Common;
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

        const deploymentLabels = existingLabels ? [...existingLabels, ...labels] : labels;
        actions
            .doSetLabels(deploymentId, deploymentLabels)
            .then(() => {
                // State updates should be done before calling `onHide` to avoid React errors:
                // "Warning: Can't perform a React state update on an unmounted component"
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
                <Icon name="tags" /> {header || i18n.t('widgets.common.labels.modalHeader', { deploymentId })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={i18n.t('widgets.common.labels.inputName')}
                        help={i18n.t('widgets.common.labels.inputHelp')}
                    >
                        <LabelsInput
                            hideInitialLabels={!!existingLabels}
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
                    content={applyButtonContent || i18n.t('widgets.common.labels.modalApplyButton')}
                    color="green"
                />
            </Modal.Actions>
        </Modal>
    );
}

ManageModal.propTypes = {
    applyButtonContent: PropTypes.string,
    deploymentId: PropTypes.string.isRequired,
    existingLabels: Stage.PropTypes.Labels,
    header: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

ManageModal.defaultProps = {
    applyButtonContent: null,
    existingLabels: null,
    header: null
};
