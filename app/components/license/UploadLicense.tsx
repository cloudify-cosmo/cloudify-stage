// @ts-nocheck File not migrated fully to TS
import i18n from 'i18next';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import { Button, ErrorMessage, Form, Segment } from '../basic';

export default function UploadLicense({ error, isLoading, license, onChange, onErrorDismiss, onUpload }) {
    return (
        <Segment>
            <Form
                errors={error}
                errorMessageHeader={i18n.t('licenseManagement.errorHeader', 'License error')}
                onErrorsDismiss={onErrorDismiss}
            >
                <Form.TextArea
                    name="license"
                    error={!!error}
                    placeholder={i18n.t(
                        'licenseManagement.licensePlaceholder',
                        'Paste the complete license string, including the license signature'
                    )}
                    value={license}
                    onChange={onChange}
                    disabled={isLoading}
                />

                <Button
                    content={i18n.t('licenseManagement.update', 'Update')}
                    icon="upload"
                    color="yellow"
                    labelPosition="left"
                    disabled={_.isEmpty(license)}
                    loading={isLoading}
                    onClick={onUpload}
                />
            </Form>
        </Segment>
    );
}

UploadLicense.propTypes = {
    error: ErrorMessage.propTypes.error,
    isLoading: PropTypes.bool.isRequired,
    license: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onErrorDismiss: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired
};

UploadLicense.defaultProps = {
    error: ''
};
