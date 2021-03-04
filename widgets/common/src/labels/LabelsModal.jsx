import LabelsInput from './LabelsInput';

export default function LabelsModal({
    deploymentId,
    hideInitialLabels,
    i18nHeaderKey,
    i18nApplyKey,
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
    const [initialLabels, setInitialLabels, resetInitialLabels] = useResettableState([]);

    useOpenProp(open, () => {
        clearErrors();
        resetLabels();
        resetInitialLabels();

        setLoading();
        actions
            .doGetLabels(deploymentId)
            .then(deploymentLabels => {
                if (!hideInitialLabels) setLabels(deploymentLabels);
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

        const deploymentLabels = hideInitialLabels ? [...initialLabels, ...labels] : labels;
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
                <Icon name="tags" /> {i18n.t(i18nHeaderKey, { deploymentId })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={i18n.t('widgets.common.labels.inputName')}
                        help={i18n.t('widgets.common.labels.inputHelp')}
                    >
                        <LabelsInput
                            hideInitialLabels={hideInitialLabels}
                            initialLabels={initialLabels}
                            onChange={onChange}
                            toolbox={toolbox}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={onApply} disabled={isLoading} content={i18n.t(i18nApplyKey)} color="green" />
            </Modal.Actions>
        </Modal>
    );
}

LabelsModal.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    hideInitialLabels: PropTypes.bool,
    i18nApplyKey: PropTypes.string.isRequired,
    i18nHeaderKey: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

LabelsModal.defaultProps = {
    hideInitialLabels: false
};
