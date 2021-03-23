import React, { memo, useState, useMemo } from 'react';
<<<<<<< HEAD
import i18n from 'i18next';
import log from 'loglevel';

import EventBus from '../../utils/EventBus';
import useInput from '../../utils/hooks/useInput';
import useResettableState from '../../utils/hooks/useResettableState';
import { Form, Modal } from '../basic';
import gettingStartedSchema from './schema.json';
import { isGettingStartedModalDisabledInLocalStorage, disableGettingStartedModalInLocalStorage } from './localStorage';
=======
import { Form } from 'cloudify-ui-components';
import i18n from 'i18next';
import log from 'loglevel';

import type { ChangeEvent } from 'react';

import EventBus from '../../utils/EventBus';
import gettingStartedSchema from './schema';
import { getGettingStartedModalDisabled, setGettingStartedModalDisabled } from './localStorage';
import { Button, Divider, ErrorMessage, Modal } from '../basic';
import TechnologiesStep from './steps/TechnologiesStep';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
>>>>>>> RD-1442 - refresh plugins and secrets trigger call on event bus after installation
import { validateSecretFields, validateTechnologyFields } from './formValidation';
import createTechnologiesGroups from './createTechnologiesGroups';
import { GettingStartedSchemaItem, StepName } from './model';
import ModalHeader from './ModalHeader';
import ModalContent from './ModalContent';
import ModalActions from './ModalActions';

import type {
    GettingStartedData,
    GettingStartedSchema,
    GettingStartedSecretsData,
    GettingStartedTechnologiesData
} from './model';

const castedGettingStartedSchema = gettingStartedSchema as GettingStartedSchema;

const GettingStartedModal = () => {
    const [modalOpen, setModalOpen] = useState(() => isGettingStartedModalDisabledInLocalStorage());

    const [stepName, setStepName] = useState(StepName.Technologies);
    const [stepErrors, setStepErrors, resetStepErrors] = useResettableState<string[]>([]);
    const [technologiesStepData, setTechnologiesStepData] = useState<GettingStartedTechnologiesData>({});
    const [secretsStepIndex, setSecretsStepIndex] = useState(0);
    const [secretsStepsData, setSecretsStepsData] = useState<GettingStartedData>({});

    const [installationProcessing, setInstallationProcessing] = useState(false);
    const [modalDisabledChecked, setModalDisabledChange] = useInput(false);

    // only selected technologies schemas
    const commonStepsSchemas = useMemo(
        () => castedGettingStartedSchema.filter(item => technologiesStepData[item.name]),
        [technologiesStepData]
    );

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
    const handleModalClose = () => {
        setModalOpen(false);
        if (modalDisabledChecked) {
            disableGettingStartedModalInLocalStorage();
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
                log.error('Incorrect step name');
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
<<<<<<< HEAD
            <ModalActions
                stepName={stepName}
                installationProcessing={installationProcessing}
                onBackClick={handleBackClick}
                onNextClick={handleNextClick}
                onModalClose={handleModalClose}
            />
=======
            <Modal.Actions style={{ minHeight: '60px', overflow: 'hidden' }}>
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
                {stepName !== 'status' && (
                    <Button.Group floated="right">
                        {stepName !== 'technologies' && (
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
                                stepName === 'summary'
                                    ? i18n.t('gettingStartedModal.modal.stepFinish', 'Finish')
                                    : i18n.t('gettingStartedModal.modal.stepNext', 'Next')
                            }
                            labelPosition="right"
                            onClick={handleNextClick}
                        />
                    </Button.Group>
                )}
            </Modal.Actions>
>>>>>>> RD-1442 - modal bottom actions layout fix
        </Modal>
    );
};

export default memo(GettingStartedModal);
