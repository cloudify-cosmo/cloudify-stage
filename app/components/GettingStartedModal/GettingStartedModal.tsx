import React, { memo, useState, useMemo } from 'react';
import i18n from 'i18next';
import log from 'loglevel';

import EventBus from '../../utils/EventBus';
import useInput from '../../utils/hooks/useInput';
import { Form, Button, Divider, ErrorMessage, Modal } from '../basic';
import gettingStartedSchema from './schema.json';
import { isGettingStartedModalDisabled, disableGettingStartedModal } from './localStorage';
import TechnologiesStep from './steps/TechnologiesStep';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
import { validateSecretFields, validateTechnologyFields } from './formValidation';
import createTechnologiesGroups from './createTechnologiesGroups';
import { StepName } from './model';
import ModalHeader from './ModalHeader';

import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedTechnologiesData
} from './model';

const castedGettingStartedSchema = gettingStartedSchema as GettingStartedSchema;

const GettingStartedModal = () => {
    const [modalOpen, setModalOpen] = useState(() => isGettingStartedModalDisabled());

    const [stepName, setStepName] = useState(StepName.Technologies);
    const [stepErrors, setStepErrors] = useState<string[]>([]);
    const [technologiesStepData, setTechnologiesStepData] = useState<GettingStartedTechnologiesData>({});
    const [secretsStepIndex, setSecretsStepIndex] = useState(0);
    const [secretsStepsData, setSecretsStepsData] = useState<GettingStartedData>({});

    const [installationProcessing, setInstallationProcessing] = useState(false);
    const [modalDisabledChecked, handleModalDisabledChange] = useInput(false);

    const secretsStepsSchemas = useMemo(
        () => createTechnologiesGroups(castedGettingStartedSchema.filter(items => technologiesStepData[items.name])), // steps with unique secrets for selected technologies
        [technologiesStepData]
    );

    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const secretsStepData = secretsStepsData[secretsStepSchema?.name];
    const statusStepActive = stepName === StepName.Status;

    const checkTechnologiesStepDataErrors = () => {
        const usedTechnologiesError = validateTechnologyFields(technologiesStepData);
        if (usedTechnologiesError) {
            setStepErrors([usedTechnologiesError]);
            return false;
        }
        setStepErrors([]);
        return true;
    };
    const checkSecretsStepDataErrors = () => {
        const localDataError = validateSecretFields(secretsStepSchema.secrets, secretsStepData ?? {});
        if (localDataError) {
            setStepErrors([localDataError]);
            return false;
        }
        setStepErrors([]);
        return true;
    };

    const handleStepErrorsDismiss = () => {
        setStepErrors([]);
    };
    const handleTechnologiesStepChange = (selectedTechnologies: GettingStartedTechnologiesData) => {
        setTechnologiesStepData(selectedTechnologies);
    };
    const handleSecretsStepChange = (typedSecrets: GettingStartedSecretsData) => {
        setSecretsStepsData({ ...secretsStepsData, [secretsStepSchema.name]: typedSecrets });
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
        setModalOpen(false);
        if (modalDisabledChecked) {
            disableGettingStartedModal();
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
                setStepErrors([]);
                if (secretsStepIndex > 0) {
                    setSecretsStepIndex(secretsStepIndex - 1);
                } else {
                    setStepName(StepName.Technologies);
                }
                break;

            default:
                log.error('Incorrect step name.');
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
                log.error('Incorrect step name.');
                break;
        }
    };

    return (
        <Modal open={modalOpen} onClose={handleModalClose}>
            <ModalHeader
                stepName={stepName}
                secretsStepIndex={secretsStepIndex}
                secretsStepsSchemas={secretsStepsSchemas}
            />
            <Modal.Content style={{ minHeight: 220 }}>
                {!_.isEmpty(stepErrors) && (
                    <>
                        <ErrorMessage error={stepErrors} onDismiss={handleStepErrorsDismiss} />
                        <Divider hidden />
                    </>
                )}
                {stepName === StepName.Technologies && (
                    <TechnologiesStep
                        schema={castedGettingStartedSchema}
                        selectedTechnologies={technologiesStepData}
                        onChange={handleTechnologiesStepChange}
                    />
                )}
                {stepName === StepName.Secrets && secretsStepSchema && (
                    <SecretsStep
                        selectedTechnology={secretsStepSchema}
                        typedSecrets={secretsStepData}
                        onChange={handleSecretsStepChange}
                    />
                )}
                {(stepName === StepName.Summary || statusStepActive) && (
                    <SummaryStep
                        installationMode={statusStepActive}
                        selectedPlugins={secretsStepsSchemas}
                        typedSecrets={secretsStepsData}
                        onInstallationStarted={handleInstallationStarted}
                        onInstallationFinished={handleInstallationFinishedOrCanceled}
                        onInstallationCanceled={handleInstallationFinishedOrCanceled}
                    />
                )}
            </Modal.Content>
            <Modal.Content style={{ minHeight: 60, overflow: 'hidden' }}>
                <Form.Field>
                    <Form.Checkbox
                        label={i18n.t('gettingStartedModal.disableModalLabel', "Don't show next time")}
                        help=""
                        checked={modalDisabledChecked}
                        onChange={handleModalDisabledChange}
                    />
                </Form.Field>
            </Modal.Content>
            <Modal.Actions style={{ minHeight: 60 }}>
                <Button
                    icon="cancel"
                    content={i18n.t('gettingStartedModal.buttons.closeModal', 'Close')}
                    floated="left"
                    disabled={installationProcessing}
                    labelPosition="left"
                    onClick={handleModalClose}
                />
                {!statusStepActive && (
                    <Button.Group floated="right">
                        {stepName !== StepName.Technologies && (
                            <Button
                                icon="left arrow"
                                content={i18n.t('gettingStartedModal.buttons.stepBack', 'Back')}
                                labelPosition="left"
                                onClick={handleBackClick}
                            />
                        )}
                        <Button
                            icon="right arrow"
                            content={
                                stepName === StepName.Summary
                                    ? i18n.t('gettingStartedModal.buttons.stepFinish', 'Finish')
                                    : i18n.t('gettingStartedModal.buttons.stepNext', 'Next')
                            }
                            labelPosition="right"
                            onClick={handleNextClick}
                        />
                    </Button.Group>
                )}
            </Modal.Actions>
        </Modal>
    );
};

export default memo(GettingStartedModal);
