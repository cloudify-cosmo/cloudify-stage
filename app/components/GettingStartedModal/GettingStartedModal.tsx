import React, { memo, useEffect, useMemo, useState } from 'react';
import i18n from 'i18next';
import log from 'loglevel';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import stageUtils from '../../utils/stageUtils';
import EventBus from '../../utils/EventBus';
import { useInput, useOpenProp, useBoolean } from '../../utils/hooks';
import useResettableState from '../../utils/hooks/useResettableState';
import { Confirm, Form, Modal } from '../basic';
import gettingStartedJson from './schema/gettingStarted.schema.json';
import cloudSetupJson from './schema/cloudSetup.schema.json';
import useModalOpenState from './useModalOpenState';
import createEnvironmentsGroups from './createEnvironmentsGroups';
import type {
    GettingStartedData,
    GettingStartedEnvironmentsData,
    GettingStartedSchema,
    GettingStartedSecretsData
} from './model';
import { GettingStartedSchemaItem, StepName } from './model';
import ModalHeader from './ModalHeader';
import ModalContent from './ModalContent';
import ModalActions from './ModalActions';

import type { ReduxState } from '../../reducers';
import useCloudSetupUrlParam from './useCloudSetupUrlParam';

const gettingStartedSchema = gettingStartedJson as GettingStartedSchema;
const cloudSetupSchema = cloudSetupJson as GettingStartedSchema;

const GettingStartedModal = () => {
    const modalOpenState = useModalOpenState();
    const dispatch = useDispatch();
    const manager = useSelector((state: ReduxState) => state.manager);
    const [stepName, setStepName] = useState(StepName.Welcome);
    const [environmentsStepData, setEnvironmentsStepData, resetEnvironmentsStepData] = useResettableState<
        GettingStartedEnvironmentsData
    >({});
    const [secretsStepIndex, setSecretsStepIndex, resetSecretsStepIndex] = useResettableState(0);
    const [secretsStepsData, setSecretsStepsData, resetSecretsStepsData] = useResettableState<GettingStartedData>({});

    const [installationProcessing, setInstallationProcessing, resetInstallationProcessing] = useResettableState(false);
    const [modalDisabledChecked, setModalDisabledChange] = useInput(false);
    const [cancelConfirmOpen, openCancelConfirm, closeCancelConfirm] = useBoolean();
    const [schema, setSchema] = useState(gettingStartedSchema);
    const [cloudSetupUrlParam] = useCloudSetupUrlParam();

    const commonStepsSchemas = useMemo(() => schema.filter(item => environmentsStepData[item.name]), [
        environmentsStepData
    ]);

    const secretsStepsSchemas = useMemo(() => createEnvironmentsGroups(commonStepsSchemas), [environmentsStepData]);
    const summaryStepSchemas = useMemo(() => {
        return commonStepsSchemas.reduce(
            (result, item) => {
                if (item.secrets.length === 0) {
                    result.push(item);
                }
                return result;
            },
            [...secretsStepsSchemas]
        );
    }, [commonStepsSchemas, secretsStepsSchemas]);

    useOpenProp(modalOpenState.modalOpen, () => {
        setStepName(StepName.Welcome);
        resetEnvironmentsStepData();
        resetSecretsStepIndex();
        resetSecretsStepsData();
        resetInstallationProcessing();
    });

    useEffect(() => {
        setModalDisabledChange(!modalOpenState.shouldAutomaticallyShowModal);
    }, [modalOpenState.shouldAutomaticallyShowModal]);

    useEffect(() => {
        setSchema(cloudSetupUrlParam ? cloudSetupSchema : gettingStartedSchema);
    }, [cloudSetupUrlParam]);

    if (!stageUtils.isUserAuthorized('getting_started', manager)) {
        return null;
    }

    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex] as GettingStartedSchemaItem | undefined;

    const navigateToBlueprintsPage = () => dispatch(push('/page/blueprints'));

    const handleEnvironmentsStepChange = (selectedEnvironments: GettingStartedEnvironmentsData) => {
        setEnvironmentsStepData(selectedEnvironments);
    };
    const handleSecretsStepChange = (typedSecrets: GettingStartedSecretsData) => {
        if (secretsStepSchema) {
            setSecretsStepsData({ ...secretsStepsData, [secretsStepSchema.name]: typedSecrets });
        }
    };
    const handleInstallationStarted = () => {
        setInstallationProcessing(true);
    };
    const handleInstallationFinishedOrCanceled = () => {
        EventBus.trigger('plugins:refresh');
        EventBus.trigger('secrets:refresh');
        setInstallationProcessing(false);
    };

    const handleModalClose = () => {
        if (stepName !== StepName.Status) openCancelConfirm();
        else closeModal();
    };

    const closeModal = () => {
        modalOpenState.closeModal(modalDisabledChecked);
        navigateToBlueprintsPage();
        closeCancelConfirm();
    };

    const handleBackClick = () => {
        function goToPreviousStep() {
            setStepName(stepName - 1);
        }

        switch (stepName) {
            case StepName.Environments:
            case StepName.Status:
                goToPreviousStep();
                setStepName(StepName.Welcome);
                break;

            case StepName.Summary:
                if (secretsStepsSchemas.length > 0) {
                    goToPreviousStep();
                    setSecretsStepIndex(secretsStepsSchemas.length - 1);
                } else {
                    setStepName(StepName.Environments);
                }
                break;

            case StepName.Secrets:
                if (secretsStepIndex > 0) {
                    setSecretsStepIndex(secretsStepIndex - 1);
                } else {
                    goToPreviousStep();
                }
                break;

            default:
                log.error('Incorrect step name');
                break;
        }
    };
    const handleNextClick = () => {
        function goToNextStep() {
            setStepName(stepName + 1);
        }

        switch (stepName) {
            case StepName.Environments:
                if (secretsStepsSchemas.length > 0) {
                    goToNextStep();
                    setSecretsStepIndex(0);
                } else {
                    setStepName(StepName.Summary);
                }
                break;

            case StepName.Secrets:
                if (secretsStepIndex < secretsStepsSchemas.length - 1) {
                    setSecretsStepIndex(secretsStepIndex + 1);
                } else {
                    goToNextStep();
                }
                break;

            case StepName.Welcome:
            case StepName.Summary:
                goToNextStep();
                break;

            default:
                log.error('Incorrect step name');
                break;
        }
    };

    return (
        <Modal open={modalOpenState.modalOpen} onClose={handleModalClose}>
            <ModalHeader
                stepName={stepName}
                secretsStepIndex={secretsStepIndex}
                secretsStepsSchemas={secretsStepsSchemas}
            />
            <ModalContent
                stepName={stepName}
                environmentsStepData={environmentsStepData}
                secretsStepsSchemas={secretsStepsSchemas}
                secretsStepsData={secretsStepsData}
                secretsStepIndex={secretsStepIndex}
                summaryStepSchemas={summaryStepSchemas}
                schema={schema}
                onEnvironmentsStepChange={handleEnvironmentsStepChange}
                onSecretsStepChange={handleSecretsStepChange}
                onInstallationStarted={handleInstallationStarted}
                onInstallationFinished={handleInstallationFinishedOrCanceled}
                onInstallationCanceled={handleInstallationFinishedOrCanceled}
            />
            {stepName !== StepName.Welcome && !cloudSetupUrlParam && (
                <Modal.Content style={{ minHeight: 60, overflow: 'hidden' }}>
                    <Form.Field>
                        <Form.Checkbox
                            label={i18n.t('gettingStartedModal.disableModalLabel')}
                            help=""
                            checked={modalDisabledChecked}
                            onChange={setModalDisabledChange}
                        />
                    </Form.Field>
                </Modal.Content>
            )}
            <ModalActions
                stepName={stepName}
                installationProcessing={installationProcessing}
                onBackClick={handleBackClick}
                onNextClick={handleNextClick}
                onModalClose={handleModalClose}
                environmentsStepData={environmentsStepData}
            />
            <Confirm
                open={cancelConfirmOpen}
                content={i18n.t('gettingStartedModal.cancelConfirm')}
                onConfirm={closeModal}
                onCancel={closeCancelConfirm}
            />
        </Modal>
    );
};

export default memo(GettingStartedModal);
