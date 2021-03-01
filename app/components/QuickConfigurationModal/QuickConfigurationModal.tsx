import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useContext, useRef, ChangeEvent, useState, useEffect } from 'react';
import { ThemeContext } from 'styled-components';
import { Form, HeaderBar } from 'cloudify-ui-components';
import i18n from 'i18next';

import { Button, Icon } from 'semantic-ui-react';
import { CancelButton, Divider, Header, Modal } from '../basic';
import { JSONSchema, JSONSchemaItem } from './model';

import QuickConfigurationButton from './QuickConfigurationButton';
import UncontrolledForm from './UncontrolledForm';

type SecretData = Record<string, string>;
type JSONData = Record<string, SecretData>;

const getItemData = (schema: JSONSchema, data?: JSONData, step?: number) => {
    if (data && step) {
        const item = schema[step];
        if (item) {
            return data[item?.name];
        }
    }
    return undefined;
};

type Props = {
    open?: boolean;
    step?: number;
    schema: JSONSchema;
    data?: JSONData;
    onClose?: () => void;
};

const QuickConfigurationModal = ({ open = false, step = 0, schema, data, onClose }: Props) => {
    // const formRef = useRef<HTMLFormElement>(null);
    const [localStep, setLocalStep] = useState(step);
    const [localData, setLocalData] = useState(() => data ?? {});
    useEffect(() => setLocalStep(step), [step]);
    useEffect(() => setLocalData(data ?? {}), [data]);
    // const open = true;
    const handleClose = () => {
        // console.error('handleHide');
        onClose?.();
    };
    const selectedItemSchema = schema[localStep - 1];
    const selectedItemData = localData[selectedItemSchema?.name];
    return (
        <Modal open={open} onClose={handleClose}>
            <UncontrolledForm<SecretData | undefined>
                // ref={formRef}
                data={selectedItemData}
                onSubmit={(newData: SecretData | undefined) => {
                    if (selectedItemSchema) {
                        setLocalData({ ...localData, [selectedItemSchema.name]: newData } as JSONData);
                    } else {
                        setLocalData(localData);
                    }
                    console.log(JSON.stringify(newData, null, 4));
                    if (localStep < schema.length - 1) {
                        setLocalStep(localStep + 1);
                    }
                }}
            >
                <Modal.Header>
                    <HeaderBar>
                        {selectedItemSchema ? `${selectedItemSchema.name} Secrets` : 'Getting Started'}
                    </HeaderBar>
                </Modal.Header>

                <Modal.Content>
                    {localStep === 0 && (
                        <>
                            {schema.map(itemSchema => {
                                const itemData = localData[itemSchema.name];
                                return (
                                    <div key={itemSchema.name}>
                                        <QuickConfigurationButton
                                            name={`${itemSchema.name}.name`}
                                            logo={itemSchema.logo}
                                            label={itemSchema.label}
                                            value={!!itemData}
                                        />
                                    </div>
                                );
                            })}
                            <Form.Field>
                                <Form.Checkbox
                                    name="modalDisabled"
                                    label="Don't show next time"
                                    help="You can enable modal always in user profile."
                                />
                            </Form.Field>
                        </>
                    )}
                    {localStep > 0 && (
                        <>
                            {selectedItemSchema.secrets.map(itemSecret => {
                                const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newItemData = { ...selectedItemData, [itemSecret.name]: e.target.value };
                                    const newLocalData = { ...localData, [selectedItemSchema?.name]: newItemData };
                                    setLocalData(newLocalData);
                                };
                                return (
                                    <div key={itemSecret.name}>
                                        <Form.Field>
                                            <Form.Input
                                                name={itemSecret.name}
                                                type={itemSecret.type}
                                                label={itemSecret.label}
                                                value={selectedItemData?.[itemSecret.name]}
                                                onChange={handleInputChange}
                                            />
                                        </Form.Field>
                                    </div>
                                );
                            })}
                        </>
                    )}
                    {/*
                    <Header>{i18n.t('help.aboutModal.versionDetails', 'Version Details')}</Header>
                    <Divider />
                    <CurrentVersion version={version} />

                    <Header>{i18n.t('help.aboutModal.licenseDetails', 'License Details')}</Header>
                    <Divider />
                    <CurrentLicense license={license} />

                    <EulaLink />
                    */}
                </Modal.Content>

                <Modal.Actions>
                    {/* {canLicenseManagement && (
                        <Button
                            content={i18n.t('help.aboutModal.licenseManagement', 'License Management')}
                            icon="key"
                            color="yellow"
                            onClick={onLicenseManagement}
                        />
                    )} */}
                    <CancelButton content={i18n.t('help.aboutModal.close', 'Close')} onClick={handleClose} />
                    <Button.Group>
                        {localStep > 0 && (
                            <Button type="submit">
                                Back
                                <Icon name="left arrow" />
                            </Button>
                        )}
                        <Button type="submit">
                            Next
                            <Icon name="right arrow" />
                        </Button>
                    </Button.Group>
                </Modal.Actions>
            </UncontrolledForm>
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

export default QuickConfigurationModal;
