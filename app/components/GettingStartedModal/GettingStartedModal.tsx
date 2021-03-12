import React, { memo, useRef, useState, useEffect, useMemo } from 'react';
import { Form } from 'cloudify-ui-components';
import i18n from 'i18next';
import { Button, Divider, Message, ModalHeader, Ref as SemanticRef } from 'semantic-ui-react';

import { Modal } from '../basic';
import { GettingStartedData, GettingStartedSchema, GettingStartedTechnologiesData } from './model';
import { getFormData } from './common/formUtils';
import createCheckboxRefExtractor from './common/createCheckboxRefExtractor';
import TechnologiesStep from './steps/TechnologiesStep/index';
import SecretsStep from './steps/SecretsStep';
import SummaryStep from './steps/SummaryStep/SummaryStep';
import { validateSecretFields, validateTechnologyFields } from './formValidation';

const getHeaderText = (schema: GettingStartedSchema, step: number) => {
    if (step === 0) {
        return 'Getting Started';
    }
    const itemSchema = schema[step - 1];
    if (itemSchema) {
        return `${itemSchema.label} Secrets`;
    }
    return 'Summary & Status';
};

/**
 * Returns information what technologies are selected using technology forms schema and data.
 * e.g. result: { aws: true, gpc: false }
 * @param schema schema that describes technology forms (once schema item describes secrets set for specific technology)
 * @param data data that can be bound into form that are complies with technology forms schema
 * @returns information about selected technologies
 */
const detectTechnologies = (schema: GettingStartedSchema, data?: GettingStartedData) => {
    if (data) {
        return schema.reduce((result, item) => {
            result[item.name] = item.name in data;
            return result;
        }, {} as GettingStartedTechnologiesData);
    }
    return {} as GettingStartedTechnologiesData;
};

type Props = {
    open?: boolean;
    step?: number;
    schema: GettingStartedSchema;
    data?: GettingStartedData;
    onClose?: (permanentClose: boolean) => void;
};

const QuickConfigurationModal = ({ open = false, step = 0, schema, data, onClose }: Props) => {
    const modalDisabledInputRef = useRef<HTMLInputElement>(null);
    const technologiesFormRef = useRef<HTMLFormElement>(null);
    const secretsFormRef = useRef<HTMLFormElement>(null);
    const [detectedTechnologies, setDetectedTechnologies] = useState<GettingStartedTechnologiesData>(() => ({}));
    const [localStep, setLocalStep] = useState(step);
    const [localData, setLocalData] = useState(() => data ?? {});
    const [installationProcessing, setInstallationProcessing] = useState(false);
    const [currentErrors, setCurrentErrors] = useState<string[]>([]);
    useEffect(() => setDetectedTechnologies(detectTechnologies(schema, data)), [schema, data]);
    useEffect(() => setLocalStep(step), [step]);
    useEffect(() => setLocalData(data ?? {}), [data]);
    const selectedSchemas = useMemo(() => schema.filter(items => detectedTechnologies[items.name]), [
        detectedTechnologies
    ]);
    const selectedSchema = selectedSchemas[localStep - 1];
    const updateDetectedTechnologies = () => {
        if (technologiesFormRef.current) {
            const newUsedTechnologies = getFormData<GettingStartedTechnologiesData>(technologiesFormRef.current);
            const usedTechnologiesErrors = validateTechnologyFields(newUsedTechnologies);
            if (usedTechnologiesErrors.length > 0) {
                setCurrentErrors(usedTechnologiesErrors);
                return false;
            }
            setCurrentErrors([]);
            setDetectedTechnologies(newUsedTechnologies);
        }
        return true;
    };
    const updateLocalData = () => {
        if (secretsFormRef.current) {
            const newLocalData = getFormData<GettingStartedData>(secretsFormRef.current);
            const newSecretsData = newLocalData[selectedSchema.name];
            const localDataErrors = validateSecretFields(newSecretsData ?? {});
            if (localDataErrors.length > 0) {
                setCurrentErrors(localDataErrors);
                return false;
            }
            setCurrentErrors([]);
            setLocalData({ ...localData, ...newLocalData });
        }
        return true;
    };
    const handleInstallationStarted = () => {
        setInstallationProcessing(true);
    };
    const handleInstallationFinished = () => {
        setInstallationProcessing(false);
    };
    const handleInstallationCanceled = () => {
        setInstallationProcessing(false);
    };
    const handleModalClose = () => {
        onClose?.(modalDisabledInputRef.current?.checked ?? false);
    };
    const handleBackClick = () => {
        if (localStep > 0) {
            if (secretsFormRef.current) {
                const newLocalData = getFormData<GettingStartedData>(secretsFormRef.current);
                setLocalData({ ...localData, ...newLocalData });
            }
            setLocalStep(localStep - 1);
        }
    };
    const handleNextClick = () => {
        if (localStep === 0) {
            if (!updateDetectedTechnologies()) {
                return;
            }
        } else if (!updateLocalData()) {
            return;
        }
        if (localStep < schema.length - 1) {
            setLocalStep(localStep + 1);
        }
    };
    return (
        <Modal open={open} onClose={handleModalClose}>
            <Modal.Header>
                <ModalHeader>{getHeaderText(selectedSchemas, localStep)}</ModalHeader>
            </Modal.Header>
            <Modal.Content style={{ minHeight: '220px' }}>
                {currentErrors && currentErrors.length > 0 && (
                    <>
                        <Message color="red">
                            {currentErrors.map(error => (
                                <div key={error}>{error}</div>
                            ))}
                        </Message>
                        <Divider hidden />
                    </>
                )}
                {localStep === 0 && (
                    <TechnologiesStep ref={technologiesFormRef} schema={schema} technologies={detectedTechnologies} />
                )}
                {localStep > 0 && localStep < selectedSchemas.length + 1 && (
                    <SecretsStep ref={secretsFormRef} selectedPlugin={selectedSchema} typedSecrets={localData} />
                )}
                {(localStep === selectedSchemas.length + 1 || localStep === selectedSchemas.length + 2) && (
                    <SummaryStep
                        installationMode={localStep === selectedSchemas.length + 2}
                        selectedPlugins={selectedSchemas}
                        typedSecrets={localData}
                        onInstallationStarted={handleInstallationStarted}
                        onInstallationFinished={handleInstallationFinished}
                        onInstallationCanceled={handleInstallationCanceled}
                    />
                )}
            </Modal.Content>
            <Modal.Content>
                <Form.Field>
                    <SemanticRef innerRef={createCheckboxRefExtractor(modalDisabledInputRef)}>
                        <Form.Checkbox
                            label="Don't show next time"
                            help="You can enable modal always in user profile."
                        />
                    </SemanticRef>
                </Form.Field>
            </Modal.Content>
            <Modal.Actions style={{ overflow: 'hidden' }}>
                <Button.Group floated="left">
                    <Button
                        icon="cancel"
                        content={i18n.t('help.aboutModal.close', 'Close')}
                        floated="left"
                        disabled={installationProcessing}
                        labelPosition="left"
                        onClick={handleModalClose}
                    />
                </Button.Group>
                {localStep < selectedSchemas.length + 2 && (
                    <Button.Group floated="right">
                        {localStep > 0 && (
                            <Button
                                icon="left arrow"
                                content={i18n.t('help.aboutModal.back', 'Back')}
                                labelPosition="left"
                                onClick={handleBackClick}
                            />
                        )}
                        <Button
                            icon="right arrow"
                            content={
                                localStep < selectedSchemas.length + 1
                                    ? i18n.t('help.aboutModal.next', 'Next')
                                    : i18n.t('help.aboutModal.finish', 'Finish')
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

export default memo(QuickConfigurationModal);
