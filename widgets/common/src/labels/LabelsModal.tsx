import { FunctionComponent } from 'react';
import LabelsInput from './LabelsInput';
import type { Label } from './types';
import ResourceTypeContext from '../filters/resourceTypeContext';

export interface LabelsModalProps {
    deploymentId: string;
    deploymentName: string;
    hideInitialLabels?: boolean;
    i18nHeaderKey: string;
    i18nApplyKey: string;
    open: boolean;
    onHide: () => void;
    toolbox: Stage.Types.Toolbox;
}

const LabelsModal: FunctionComponent<LabelsModalProps> = ({
    deploymentId,
    deploymentName,
    hideInitialLabels = false,
    i18nHeaderKey,
    i18nApplyKey,
    open,
    onHide,
    toolbox
}) => {
    const { i18n } = Stage;
    const { ApproveButton, CancelButton, Icon, Modal, Form } = Stage.Basic;
    const { DeploymentActions } = Stage.Common;
    const { useBoolean, useErrors, useOpenProp, useResettableState } = Stage.Hooks;
    const actions = new DeploymentActions(toolbox);

    const [isLoading, setLoading, unsetLoading] = useBoolean();
    const { errors, clearErrors, setErrors, setMessageAsError } = useErrors();
    const [labels, setLabels, resetLabels] = useResettableState<Label[]>([]);
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

    function onChange(newLabels: Label[]) {
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
                toolbox.getEventBus().trigger('labels:refresh');
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
                <Icon name="tags" />{' '}
                {i18n.t(i18nHeaderKey, {
                    deploymentName: Stage.Utils.formatDisplayName({ id: deploymentId, displayName: deploymentName })
                })}
            </Modal.Header>

            <Modal.Content>
                <Form loading={isLoading} errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field
                        label={i18n.t('widgets.common.labels.input.label')}
                        help={i18n.t('widgets.common.labels.input.help')}
                    >
                        <ResourceTypeContext.Provider value="deployments">
                            <LabelsInput
                                hideInitialLabels={hideInitialLabels}
                                initialLabels={initialLabels}
                                onChange={onChange}
                                toolbox={toolbox}
                            />
                        </ResourceTypeContext.Provider>
                    </Form.Field>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={onHide} disabled={isLoading} />
                <ApproveButton onClick={onApply} disabled={isLoading} content={i18n.t(i18nApplyKey)} color="green" />
            </Modal.Actions>
        </Modal>
    );
};
export default LabelsModal;
