import React, { memo, useRef, useState, useEffect, useMemo } from 'react';
import { Form } from 'cloudify-ui-components';
import i18n from 'i18next';
import { Button, Divider, Message, ModalHeader, Ref as SemanticRef } from 'semantic-ui-react';

import { Modal } from '../basic';
import { getFormData } from './common/UncontrolledForm/formUtils';
import createCheckboxRefExtractor from './common/UncontrolledForm/createCheckboxRefExtractor';
import TechnologiesStep from './steps/TechnologiesStep/index';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep';
import { validateSecretFields, validateTechnologyFields } from './formValidation';
import createTechnologiesGroups from './createTechnologiesGroups';

import type { GettingStartedData, GettingStartedSchema, GettingStartedTechnologiesData } from './model';

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
    const modalDisabledInputRef = useRef<HTMLInputElement>(null);
    const technologiesFormRef = useRef<HTMLFormElement>(null);
    const secretsFormRef = useRef<HTMLFormElement>(null);
    const [stepName, setStepName] = useState<StepName>('technologies');
    const [stepErrors, setStepErrors] = useState<string[]>([]);
    const [technologiesStepData, setTechnologiesStepData] = useState<GettingStartedTechnologiesData>(() => ({}));
    const [secretsStepIndex, setSecretsStepIndex] = useState(0);
    const [secretsStepData, setSecretsStepData] = useState(() => ({}));
    const [installationProcessing, setInstallationProcessing] = useState(false);
    useEffect(() => setTechnologiesStepData(detectSelectedTechnologies(schema, data)), [schema, data]);
    useEffect(() => setSecretsStepIndex(step), [step]);
    useEffect(() => setSecretsStepData(data ?? {}), [data]);
    const secretsStepsSchemas = useMemo(
        () => createTechnologiesGroups(schema.filter(items => technologiesStepData[items.name])), // steps with unique secrets for selected technologies
        [technologiesStepData]
    );
    const secretsStepSchema = secretsStepsSchemas[secretsStepIndex];
    const updateTechnologiesStepData = () => {
        if (technologiesFormRef.current) {
            const newSelectedTechnologies = getFormData<GettingStartedTechnologiesData>(technologiesFormRef.current);
            const usedTechnologiesErrors = validateTechnologyFields(newSelectedTechnologies);
            if (usedTechnologiesErrors.length > 0) {
                setStepErrors(usedTechnologiesErrors);
                return false;
            }
            setStepErrors([]);
            setTechnologiesStepData(newSelectedTechnologies);
        }
        return true;
    };
    const updateSecretsStepData = (validationRequired = true) => {
        if (secretsFormRef.current) {
            const newLocalData = getFormData<GettingStartedData>(secretsFormRef.current);
            if (validationRequired) {
                const newSecretsData = newLocalData[secretsStepSchema.name];
                const localDataErrors = validateSecretFields(newSecretsData ?? {});
                if (localDataErrors.length > 0) {
                    setStepErrors(localDataErrors);
                    return false;
                }
            }
            setStepErrors([]);
            setSecretsStepData({ ...secretsStepData, ...newLocalData });
        }
        return true;
    };
    const handleInstallationStarted = () => {
        setInstallationProcessing(true);
    };
    const handleInstallationFinishedOrCanceled = () => {
        setInstallationProcessing(false);
    };
    const handleModalClose = () => {
        onClose?.(modalDisabledInputRef.current?.checked ?? false);
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
                updateSecretsStepData(false);
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
                if (updateTechnologiesStepData()) {
                    setStepName('secrets');
                    setSecretsStepIndex(0);
                }
                break;

            case 'secrets':
                if (updateSecretsStepData()) {
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
                    <TechnologiesStep ref={technologiesFormRef} schema={schema} technologies={technologiesStepData} />
                )}
                {stepName === 'secrets' && secretsStepSchema && (
                    <SecretsStep
                        ref={secretsFormRef}
                        selectedPlugin={secretsStepSchema}
                        typedSecrets={secretsStepData}
                    />
                )}
                {(stepName === 'summary' || stepName === 'status') && (
                    <SummaryStep
                        installationMode={stepName === 'status'}
                        selectedPlugins={secretsStepsSchemas}
                        typedSecrets={secretsStepData}
                        onInstallationStarted={handleInstallationStarted}
                        onInstallationFinished={handleInstallationFinishedOrCanceled}
                        onInstallationCanceled={handleInstallationFinishedOrCanceled}
                    />
                )}
            </Modal.Content>
            <Modal.Content style={{ minHeight: '50px' }}>
                <Form.Field>
                    <SemanticRef innerRef={createCheckboxRefExtractor(modalDisabledInputRef)}>
                        <Form.Checkbox
                            label={i18n.t('gettingStartedModal.modal.disableModalLabel', "Don't show next time")}
                            help={i18n.t(
                                'gettingStartedModal.modal.enableModalHelp',
                                'You can enable modal always in user profile.'
                            )}
                        />
                    </SemanticRef>
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
                                secretsStepIndex < secretsStepsSchemas.length + 1
                                    ? i18n.t('gettingStartedModal.modal.stepNext', 'Next')
                                    : i18n.t('gettingStartedModal.modal.stepFinish', 'Finish')
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
