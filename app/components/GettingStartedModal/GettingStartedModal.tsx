import React, { memo, useState, useMemo } from 'react';
import i18n from 'i18next';
import log from 'loglevel';

import EventBus from '../../utils/EventBus';
import gettingStartedSchema from './schema';
import { getGettingStartedModalDisabled, setGettingStartedModalDisabled } from './localStorage';
import { Button, Divider, ErrorMessage, Modal } from '../basic';
import TechnologiesStep from './steps/TechnologiesStep';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
import { validateSecretFields, validateTechnologyFields } from './formValidation';
import createTechnologiesGroups from './createTechnologiesGroups';

import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedTechnologiesData
} from './model';
import useInput from '../../utils/hooks/useInput';

const getHeaderText = (schema: GettingStartedSchema, stepName: StepName, secretsStepIndex: number) => {
    switch (stepName) {
        case StepName.Technologies:
            return i18n.t('gettingStartedModal.modal.technologiesStepTitle', 'Getting Started');
        case StepName.Secrets: {
            const schemaItem = schema[secretsStepIndex];
            if (schemaItem) {
                return `${schemaItem.label} ${i18n.t('gettingStartedModal.modal.secretsStepTitle', 'Secrets')}`;
            }
            return undefined;
        }
        case StepName.Summary:
            return i18n.t('gettingStartedModal.modal.summaryStepTitle', 'Summary');
        case StepName.Status:
            return i18n.t('gettingStartedModal.modal.statusStepTitle', 'Status');
        default:
            return undefined;
    }
};

enum StepName {
    Technologies,
    Secrets,
    Summary,
    Status
}

const GettingStartedModal = () => {
    const { Form } = Stage.Basic;

    const [modalOpen, setModalOpen] = useState(() => getGettingStartedModalDisabled());

    const [stepName, setStepName] = useState(StepName.Technologies);
    const [stepErrors, setStepErrors] = useState<string[]>([]);
    const [technologiesStepData, setTechnologiesStepData] = useState<GettingStartedTechnologiesData>({});
    const [secretsStepIndex, setSecretsStepIndex] = useState(0);
    const [secretsStepsData, setSecretsStepsData] = useState<GettingStartedData>({});

    const [installationProcessing, setInstallationProcessing] = useState(false);

    // only selected technologies schemas
    const commonStepsSchemas = useMemo(() => gettingStartedSchema.filter(item => technologiesStepData[item.name]), [
        technologiesStepData
    ]);
    // selected technologies schemas grouped by common secrets that are used to create secret steps
    const secretsStepsSchemas = useMemo(() => createTechnologiesGroups(commonStepsSchemas), [technologiesStepData]);
    // some technologies schemas details that doesn't have defined secrets should be sent to installation process too
    // because of plugins and blueprints can be defined there
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

    const [modalDisabledChecked, handleModalDisabledChange] = useInput(false);

    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const secretsStepData = secretsStepsData[secretsStepSchema?.name];

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
            setGettingStartedModalDisabled(true);
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
                    if (secretsStepsSchemas.length > 0) {
                        setStepName(StepName.Secrets);
                        setSecretsStepIndex(0);
                    } else {
                        setStepName(StepName.Summary);
                    }
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
            <Modal.Header>{getHeaderText(secretsStepsSchemas, stepName, secretsStepIndex)}</Modal.Header>
            <Modal.Content style={{ minHeight: 220 }}>
                {stepErrors && stepErrors.length > 0 && (
                    <>
                        <ErrorMessage error={stepErrors} onDismiss={handleStepErrorsDismiss} />
                        <Divider hidden />
                    </>
                )}
                {stepName === StepName.Technologies && (
                    <TechnologiesStep
                        schema={gettingStartedSchema}
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
                {(stepName === StepName.Summary || stepName === StepName.Status) && (
                    <SummaryStep
                        installationMode={stepName === StepName.Status}
                        selectedTechnologies={summaryStepSchemas}
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
                        name="modalDisabledChecked"
                        label={i18n.t('gettingStartedModal.modal.disableModalLabel', "Don't show next time")}
                        help=""
                        checked={modalDisabledChecked}
                        onChange={handleModalDisabledChange}
                    />
                </Form.Field>
            </Modal.Content>
            <Modal.Actions style={{ minHeight: 60 }}>
                <Button.Group floated="left">
                    <Button
                        icon="cancel"
                        content={i18n.t('gettingStartedModal.modal.closeModal', 'Close')}
                        floated="left"
                        disabled={installationProcessing}
                        labelPosition="left"
                        onClick={handleModalClose}
                    />
                </Button.Group>
                {stepName !== StepName.Status && (
                    <Button.Group floated="right">
                        {stepName !== StepName.Technologies && (
                            <Button
                                icon="left arrow"
                                content={i18n.t('gettingStartedModal.modal.stepBack', 'Back')}
                                labelPosition="left"
                                onClick={handleBackClick}
                            />
                        )}
                        <Button
                            icon="right arrow"
                            content={
                                stepName === StepName.Summary
                                    ? i18n.t('gettingStartedModal.modal.stepFinish', 'Finish')
                                    : i18n.t('gettingStartedModal.modal.stepNext', 'Next')
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
