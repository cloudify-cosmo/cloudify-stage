import _ from 'lodash';
import React, { memo, useContext, useRef, ChangeEvent, useState, useEffect, useMemo } from 'react';
import { ThemeContext } from 'styled-components';
import { Form, HeaderBar } from 'cloudify-ui-components';
import i18n from 'i18next';

import { Button, Icon, Ref as SemanticRef } from 'semantic-ui-react';
import { CancelButton, Divider, Header, Modal } from '../basic';
import { JSONData, JSONSchema, JSONSchemaItem, TechnologyData } from './model';

import TechnologyButton from './TechnologyButton';
import UncontrolledForm from './UncontrolledForm';
import { getFormData } from './formUtils';
import PluginsStep from './steps/PluginsStep';
import createCheckboxRefExtractor from './createCheckboxRefExtractor';

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

const detectTechnologies = (schema: JSONSchema, data?: JSONData) => {
    if (data) {
        return schema.reduce((result, item) => {
            result[item.name] = item.name in data;
            return result;
        }, {} as TechnologyData);
    }
    return {} as TechnologyData;
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
    const [detectedTechnologies, setDetectedTechnologies] = useState<TechnologyData>(() => ({}));
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
        // TODO: check and save disabled modal flag
        onClose?.(modalDisabledInputRef.current?.checked ?? false);
    };
    // const handleCloseClick = () => {
    //     // TODO: check and save disabled modal flag
    //     onClose?.(modalDisabledInputRef.current?.checked ?? false);
    // };
    const handleBackClick = () => {
        if (localStep > 0) {
            const newLocalData = getFormData<JSONData>(secretsFormRef.current!);
            setLocalData({ ...localData, ...newLocalData });
            setLocalStep(localStep - 1);
            // TODO: remove it
            console.log(JSON.stringify(newLocalData, null, 4));
        }
    };
    const handleNextClick = () => {
        if (localStep === 0) {
            const newUsedTechnologies = getFormData<TechnologyData>(technologiesFormRef.current!);
            setDetectedTechnologies(newUsedTechnologies);
            // TODO: remove it
            console.log(JSON.stringify(newUsedTechnologies, null, 4));
        } else {
            const newLocalData = getFormData<JSONData>(secretsFormRef.current!);
            setLocalData({ ...localData, ...newLocalData });
            // TODO: remove it
            console.log(JSON.stringify(newLocalData, null, 4));
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
                    <>
                        <UncontrolledForm<TechnologyData> ref={technologiesFormRef} data={detectedTechnologies}>
                            {schema.map(itemSchema => (
                                <TechnologyButton
                                    key={itemSchema.name}
                                    name={itemSchema.name}
                                    logo={itemSchema.logo}
                                    label={itemSchema.label}
                                />
                            ))}
                        </UncontrolledForm>
                    </>
                )}
                {localStep > 0 && (
                    <UncontrolledForm<JSONData> ref={secretsFormRef} data={localData}>
                        {selectedItemSchema?.secrets.map(itemSecret => (
                            <Form.Field key={itemSecret.name}>
                                <Form.Input
                                    name={`${selectedItemSchema.name}.${itemSecret.name}`}
                                    type={itemSecret.type}
                                    label={itemSecret.label}
                                />
                            </Form.Field>
                        ))}
                    </UncontrolledForm>
                )}
                {localStep > selectedItemSchemas.length && (
                    <PluginsStep schema={selectedItemSchemas} data={localData} />
                )}
                {/*
                    <Header>{i18n.t('help.aboutModal.versionDetails', 'Version Details')}</Header>
                    <Divider />
                */}
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

// QuickConfigurationModal.propTypes = {
//     open: PropTypes.bool,
//     onClose: PropTypes.func
// };

// QuickConfigurationModal.defaultProps = {
//     open: false,
//     onClose: undefined
// };

export default memo(QuickConfigurationModal);
