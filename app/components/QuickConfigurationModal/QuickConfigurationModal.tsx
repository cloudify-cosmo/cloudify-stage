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

type JSONData = Record<string, Record<string, string>>;

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
    const formRef = useRef();
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
            <Form
                onSubmit={e => {
                    if (localStep < schema.length - 1) {
                        setLocalStep(localStep + 1);
                    }
                }}
            >
                <Modal.Header>
                    <HeaderBar>
                        Getting Started
                        {/* <Banner hideOnSmallScreen={false} /> */}
                    </HeaderBar>
                </Modal.Header>

                <Modal.Content>
                    <Divider />
                    {localStep === 0 && (
                        <div>
                            {schema.map(itemSchema => {
                                const itemData = localData[itemSchema.name];
                                return (
                                    <div key={itemSchema.name}>
                                        <QuickConfigurationButton
                                            name={itemSchema.name}
                                            logo={itemSchema.logo}
                                            value={!!itemData}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    {localStep > 0 && (
                        <div>
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
                        </div>
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

                    <Button type="submit">
                        Next
                        <Icon name="right arrow" />
                    </Button>
                </Modal.Actions>
            </Form>
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
