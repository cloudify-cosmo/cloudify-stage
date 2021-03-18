import React, { memo, useState, useEffect, useMemo } from 'react';
import { Form } from 'cloudify-ui-components';
import i18n from 'i18next';
import { Button, Divider, Message, ModalHeader } from 'semantic-ui-react';

import type { ChangeEvent } from 'react';

import { Modal } from '../basic';
import TechnologiesStep from './steps/TechnologiesStep/index';
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

const getHeaderText = (schema: GettingStartedSchema, stepName: StepName, secretsStepIndex: number) => {
    switch (stepName) {
        case 'technologies':
            return 'Getting Started';
        case 'secrets': {
            const schemaItem = schema[secretsStepIndex];
            if (schemaItem) {
                return `${schemaItem.label} Secrets`;
            }
            return undefined;
        }
        case 'summary':
            return 'Summary';
        case 'status':
            return 'Status';
        default:
            return undefined;
    }
};

/**
 * Returns information what technologies are selected using technology forms schema and data.
 * e.g. result: `{ aws: true, gpc: false }`
 * @param schema schema that describes technology forms (once schema item describes secrets set for specific technology)
 * @param data data that can be bound into form that are complies with technology forms schema
 * @returns information about selected technologies
 */
const detectSelectedTechnologies = (schema: GettingStartedSchema, data?: GettingStartedData) => {
    if (data) {
        return schema.reduce((result, item) => {
            result[item.name] = item.name in data;
            return result;
        }, {} as GettingStartedTechnologiesData);
    }
    return {} as GettingStartedTechnologiesData;
};

type StepName = 'technologies' | 'secrets' | 'summary' | 'status';

type Props = {
    open?: boolean;
    step?: number;
    schema: GettingStartedSchema;
    data?: GettingStartedData;
    onClose?: (permanentClose: boolean) => void;
};

const ControlledGettingStartedModal = ({ open = false, step = 0, schema, data, onClose }: Props) => {
    const [stepName, setStepName] = useState<StepName>('technologies');
    const [stepErrors, setStepErrors] = useState<string[]>([]);
    const [technologiesStepData, setTechnologiesStepData] = useState<GettingStartedTechnologiesData>(() => ({}));
    const [secretsStepIndex, setSecretsStepIndex] = useState(0);
    const [secretsStepsData, setSecretsStepsData] = useState(() => data ?? {});
    const [installationProcessing, setInstallationProcessing] = useState(false);
    const [modalDisabled, setModalDisabled] = useState(false);
    useEffect(() => setTechnologiesStepData(detectSelectedTechnologies(schema, data)), [schema, data]);
    useEffect(() => setSecretsStepIndex(step), [step]);
    useEffect(() => setSecretsStepsData(data ?? {}), [data]);
    // only selected technologies schemas
    const commonStepsSchemas = useMemo(() => schema.filter(item => technologiesStepData[item.name]), [
        schema,
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
    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const secretsStepData = secretsStepsData[secretsStepSchema?.name];
    const checkTechnologiesStepDataErrors = () => {
        const usedTechnologiesErrors = validateTechnologyFields(technologiesStepData);
        if (usedTechnologiesErrors.length > 0) {
            setStepErrors(usedTechnologiesErrors);
            return false;
        }
        setStepErrors([]);
        return true;
    };
    const checkSecretsStepDataErrors = () => {
        const localDataErrors = validateSecretFields(secretsStepSchema.secrets, secretsStepData ?? {});
        if (localDataErrors.length > 0) {
            setStepErrors(localDataErrors);
            return false;
        }
        setStepErrors([]);
        return true;
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
        setInstallationProcessing(false);
    };
    const handleModalDisabledChange = (e: ChangeEvent) => {
        const input = e.target.parentElement?.firstChild as HTMLInputElement | null | undefined;
        setModalDisabled(!input?.checked);
    };
    const handleModalClose = () => {
        onClose?.(modalDisabled);
    };
    const handleBackClick = () => {
        switch (stepName) {
            case 'status':
                setStepName('summary');
                break;

            case 'summary':
                if (secretsStepsSchemas.length > 0) {
                    setStepName('secrets');
                    setSecretsStepIndex(secretsStepsSchemas.length - 1);
                } else {
                    setStepName('technologies');
                }
                break;

            case 'secrets':
                setStepErrors([]);
                if (secretsStepIndex > 0) {
                    setSecretsStepIndex(secretsStepIndex - 1);
                } else {
                    setStepName('technologies');
                }
                break;

            default:
                // eslint-disable-next-line no-console
                console.error('Incorrect step name.');
                break;
        }
    };
    const handleNextClick = () => {
        switch (stepName) {
            case 'technologies':
                if (checkTechnologiesStepDataErrors()) {
                    if (secretsStepsSchemas.length > 0) {
                        setStepName('secrets');
                        setSecretsStepIndex(0);
                    } else {
                        setStepName('summary');
                    }
                }
                break;

            case 'secrets':
                if (checkSecretsStepDataErrors()) {
                    if (secretsStepIndex < secretsStepsSchemas.length - 1) {
                        setSecretsStepIndex(secretsStepIndex + 1);
                    } else {
                        setStepName('summary');
                    }
                }
                break;

            case 'summary':
                setStepName('status');
                break;

            default:
                // eslint-disable-next-line no-console
                console.error('Incorrect step name.');
                break;
        }
    };
    return (
        <Modal open={open} onClose={handleModalClose}>
            <Modal.Header>
                <ModalHeader>{getHeaderText(secretsStepsSchemas, stepName, secretsStepIndex)}</ModalHeader>
            </Modal.Header>
            <Modal.Content style={{ minHeight: '220px' }}>
                {stepErrors && stepErrors.length > 0 && (
                    <>
                        <Message color="red">
                            {stepErrors.map(error => (
                                <div key={error}>{error}</div>
                            ))}
                        </Message>
                        <Divider hidden />
                    </>
                )}
                {stepName === 'technologies' && (
                    <TechnologiesStep
                        schema={schema}
                        selectedTechnologies={technologiesStepData}
                        onChange={handleTechnologiesStepChange}
                    />
                )}
                {stepName === 'secrets' && secretsStepSchema && (
                    <SecretsStep
                        selectedTechnology={secretsStepSchema}
                        typedSecrets={secretsStepData}
                        onChange={handleSecretsStepChange}
                    />
                )}
                {(stepName === 'summary' || stepName === 'status') && (
                    <SummaryStep
                        installationMode={stepName === 'status'}
                        selectedTechnologies={summaryStepSchemas}
                        typedSecrets={secretsStepsData}
                        onInstallationStarted={handleInstallationStarted}
                        onInstallationFinished={handleInstallationFinishedOrCanceled}
                        onInstallationCanceled={handleInstallationFinishedOrCanceled}
                    />
                )}
            </Modal.Content>
            <Modal.Content style={{ minHeight: '50px', overflow: 'hidden' }}>
                <Form.Field>
                    <Form.Checkbox
                        label={i18n.t('gettingStartedModal.modal.disableModalLabel', "Don't show next time")}
                        help={i18n.t(
                            'gettingStartedModal.modal.enableModalHelp',
                            'You can enable modal always in user profile.'
                        )}
                        checked={modalDisabled}
                        onChange={handleModalDisabledChange}
                    />
                </Form.Field>
            </Modal.Content>
            <Modal.Actions style={{ overflow: 'hidden' }}>
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
        </Modal>
    );
};

export default memo(ControlledGettingStartedModal);
