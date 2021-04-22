import React, { memo, useState, useMemo } from 'react';
import i18n from 'i18next';
import log from 'loglevel';
import { useSelector } from 'react-redux';

import stageUtils from '../../utils/stageUtils';
import EventBus from '../../utils/EventBus';
import useInput from '../../utils/hooks/useInput';
import useResettableState from '../../utils/hooks/useResettableState';
import { Form, Modal } from '../basic';
import gettingStartedSchema from './schema.json';
import useModalOpenState from './useModalOpenState';
import { validateSecretFields, validateTechnologyFields } from './formValidation';
import createTechnologiesGroups from './createTechnologiesGroups';
import { GettingStartedSchemaItem, StepName } from './model';
import ModalHeader from './ModalHeader';
import ModalContent from './ModalContent';
import ModalActions from './ModalActions';

import type { ReduxState } from '../../reducers';
import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedTechnologiesData
} from './model';

const castedGettingStartedSchema = gettingStartedSchema as GettingStartedSchema;

const GettingStartedModal = () => {
    const modalOpenState = useModalOpenState();

    const manager = useSelector((state: ReduxState) => state.manager);
    const [stepName, setStepName] = useState(StepName.Technologies);
    const [stepErrors, setStepErrors, resetStepErrors] = useResettableState<string[]>([]);
    const [technologiesStepData, setTechnologiesStepData] = useState<GettingStartedTechnologiesData>({});
    const [secretsStepIndex, setSecretsStepIndex] = useState(0);
    const [secretsStepsData, setSecretsStepsData] = useState<GettingStartedData>({});

    const [installationProcessing, setInstallationProcessing] = useState(false);
    const [modalDisabledChecked, setModalDisabledChange] = useInput(false);

    const secretsStepsSchemas = useMemo(
        () => createTechnologiesGroups(castedGettingStartedSchema.filter(items => technologiesStepData[items.name])), // steps with unique secrets for selected technologies
        [technologiesStepData]
    );

    if (!stageUtils.isUserAuthorized('getting_started', manager)) {
        return null;
    }

    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex] as GettingStartedSchemaItem | undefined;
    const secretsStepData = secretsStepSchema ? secretsStepsData[secretsStepSchema.name] : undefined;

    const checkTechnologiesStepDataErrors = () => {
        const usedTechnologiesError = validateTechnologyFields(technologiesStepData);
        if (usedTechnologiesError) {
            setStepErrors([usedTechnologiesError]);
            return false;
        }
        resetStepErrors();
        return true;
    };
    const checkSecretsStepDataErrors = () => {
        if (!secretsStepSchema) {
            return false;
        }
        const localDataError = validateSecretFields(secretsStepSchema.secrets, secretsStepData ?? {});
        if (localDataError) {
            setStepErrors([localDataError]);
            return false;
        }
        resetStepErrors();
        return true;
    };

    const handleStepErrorsDismiss = () => {
        resetStepErrors();
    };
    const handleTechnologiesStepChange = (selectedTechnologies: GettingStartedTechnologiesData) => {
        setTechnologiesStepData(selectedTechnologies);
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
    const handleModalClose = async () => {
        await modalOpenState.closeModal(modalDisabledChecked);
        if (modalDisabledChecked) {
            EventBus.trigger('users:refresh');
        }
    };

    const handleBackClick = () => {
        switch (stepName) {
            case StepName.Status:
                setStepName(StepName.Summary);
                break;

            case StepName.Summary:
                if (secretsStepsSchemas.length > 0) {
                    setStepName(StepName.Secrets);
                    setSecretsStepIndex(secretsStepsSchemas.length - 1);
                } else {
                    setStepName(StepName.Technologies);
                }
                break;

            case StepName.Secrets:
                resetStepErrors();
                if (secretsStepIndex > 0) {
                    setSecretsStepIndex(secretsStepIndex - 1);
                } else {
                    setStepName(StepName.Technologies);
                }
                break;

            default:
                log.error('Incorrect step name');
                break;
        }
    };
    const handleNextClick = () => {
        switch (stepName) {
            case StepName.Technologies:
                if (checkTechnologiesStepDataErrors()) {
                    setStepName(StepName.Secrets);
                    setSecretsStepIndex(0);
                }
                break;

            case StepName.Secrets:
                if (checkSecretsStepDataErrors()) {
                    if (secretsStepIndex < secretsStepsSchemas.length - 1) {
                        setSecretsStepIndex(secretsStepIndex + 1);
                    } else {
                        setStepName(StepName.Summary);
                    }
                }
                break;

            case StepName.Summary:
                setStepName(StepName.Status);
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
                stepErrors={stepErrors}
                stepName={stepName}
                technologiesStepData={technologiesStepData}
                secretsStepsSchemas={secretsStepsSchemas}
                secretsStepsData={secretsStepsData}
                secretsStepIndex={secretsStepIndex}
                onStepErrorsDismiss={handleStepErrorsDismiss}
                onTechnologiesStepChange={handleTechnologiesStepChange}
                onSecretsStepChange={handleSecretsStepChange}
                onInstallationStarted={handleInstallationStarted}
                onInstallationFinished={handleInstallationFinishedOrCanceled}
                onInstallationCanceled={handleInstallationFinishedOrCanceled}
            />
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
            <ModalActions
                stepName={stepName}
                installationProcessing={installationProcessing}
                onBackClick={handleBackClick}
                onNextClick={handleNextClick}
                onModalClose={handleModalClose}
            />
        </Modal>
    );
};

export default memo(GettingStartedModal);
