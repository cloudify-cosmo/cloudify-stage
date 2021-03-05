import _ from 'lodash';
import React, { memo, useRef, useState, useEffect, useMemo } from 'react';
import { Form, HeaderBar } from 'cloudify-ui-components';
import i18n from 'i18next';

import { Button, Icon, Ref as SemanticRef } from 'semantic-ui-react';
import { CancelButton, Divider, Modal } from '../basic';
import { JSONData, JSONSchema, JSONSchemaItem, TechnologiesData } from './model';
import { getFormData } from './common/formUtils';
import PluginsStep from './steps/PluginsStep';
import createCheckboxRefExtractor from './common/createCheckboxRefExtractor';
import TechnologiesStep from './steps/TechnologiesStep/index';
import SecretsStep from './steps/SecretsStep';

const getHeaderText = (schema: JSONSchema, step: number) => {
    if (step === 0) {
        return 'Getting Started';
    }
    const itemSchema = schema[step - 1];
    if (itemSchema) {
        return `${itemSchema.label} Secrets`;
    }
    // TODO: split it
    return 'Summary & Status';
};

/**
 * Returns information what technologies are selected using technology forms schema and data.
 * e.g. result: { aws: true, gpc: false }
 * @param schema schema that describes technology forms (once schema item describes secrets set for specific technology)
 * @param data data that can be bound into form that are complies with technology forms schema
 * @returns information about selected technologies
 */
const detectTechnologies = (schema: JSONSchema, data?: JSONData) => {
    if (data) {
        return schema.reduce((result, item) => {
            result[item.name] = item.name in data;
            return result;
        }, {} as TechnologiesData);
    }
    return {} as TechnologiesData;
};

type Props = {
    open?: boolean;
    step?: number;
    schema: JSONSchema;
    data?: JSONData;
    onClose?: (permanentClose: boolean) => void;
};

const QuickConfigurationModal = ({ open = false, step = 0, schema, data, onClose }: Props) => {
    const modalDisabledInputRef = useRef<HTMLInputElement>(null);
    const technologiesFormRef = useRef<HTMLFormElement>(null);
    const secretsFormRef = useRef<HTMLFormElement>(null);
    const [detectedTechnologies, setDetectedTechnologies] = useState<TechnologiesData>(() => ({}));
    const [localStep, setLocalStep] = useState(step);
    const [localData, setLocalData] = useState(() => data ?? {});
    useEffect(() => setDetectedTechnologies(detectTechnologies(schema, data)), [schema, data]);
    useEffect(() => setLocalStep(step), [step]);
    useEffect(() => setLocalData(data ?? {}), [data]);
    const selectedItemSchemas = useMemo(() => schema.filter(items => detectedTechnologies[items.name]), [
        detectedTechnologies
    ]);
    const selectedItemSchema = selectedItemSchemas[localStep - 1];
    const handleModalClose = () => {
        onClose?.(modalDisabledInputRef.current?.checked ?? false);
    };
    const handleBackClick = () => {
        if (localStep > 0) {
            const newLocalData = getFormData<JSONData>(secretsFormRef.current!);
            setLocalData({ ...localData, ...newLocalData });
            setLocalStep(localStep - 1);
        }
    };
    const handleNextClick = () => {
        if (localStep === 0) {
            const newUsedTechnologies = getFormData<TechnologiesData>(technologiesFormRef.current!);
            setDetectedTechnologies(newUsedTechnologies);
        } else {
            const newLocalData = getFormData<JSONData>(secretsFormRef.current!);
            setLocalData({ ...localData, ...newLocalData });
        }
        if (localStep < schema.length - 1) {
            setLocalStep(localStep + 1);
        }
    };
    return (
        <Modal open={open} onClose={handleModalClose}>
            <Modal.Header>
                <HeaderBar>{getHeaderText(selectedItemSchemas, localStep)}</HeaderBar>
            </Modal.Header>
            <Modal.Content>
                {localStep === 0 && (
                    <TechnologiesStep ref={technologiesFormRef} schema={schema} technologies={detectedTechnologies} />
                )}
                {localStep > 0 && localStep < selectedItemSchemas.length + 1 && (
                    <SecretsStep ref={secretsFormRef} schema={selectedItemSchema} secrets={localData} />
                )}
                {localStep > selectedItemSchemas.length && (
                    <PluginsStep schema={selectedItemSchemas} data={localData} />
                )}
                <Divider />
                <Form.Field>
                    <SemanticRef innerRef={createCheckboxRefExtractor(modalDisabledInputRef)}>
                        <Form.Checkbox
                            label="Don't show next time"
                            help="You can enable modal always in user profile."
                        />
                    </SemanticRef>
                </Form.Field>
            </Modal.Content>
            <Modal.Actions>
                <CancelButton content={i18n.t('help.aboutModal.close', 'Close')} onClick={handleModalClose} />
                {localStep < selectedItemSchemas.length + 1 && (
                    <Button.Group>
                        {localStep > 0 && (
                            <Button onClick={handleBackClick}>
                                <Icon name="left arrow" />
                                Back
                            </Button>
                        )}
                        <Button onClick={handleNextClick}>
                            {localStep < selectedItemSchemas.length ? 'Next' : 'Finish'}
                            <Icon name="right arrow" />
                        </Button>
                    </Button.Group>
                )}
            </Modal.Actions>
        </Modal>
    );
};

{/*
    <Header>{i18n.t('help.aboutModal.versionDetails', 'Version Details')}</Header>
*/}

// QuickConfigurationModal.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func
// };

// QuickConfigurationModal.defaultProps = {
//     open: false,
//     onClose: undefined
// };

export default memo(QuickConfigurationModal);
