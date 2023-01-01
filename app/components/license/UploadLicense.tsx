import i18n from 'i18next';
import _ from 'lodash';
import React from 'react';
import type { ChangeEvent } from 'react';
import type { ButtonProps, FormProps } from 'semantic-ui-react';

import { Button, Form, Segment } from '../basic';

interface UploadLicenseProps {
    error?: string;
    isLoading: boolean;
    license: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>, data: any) => void;
    onErrorDismiss: FormProps['onErrorsDismiss'];
    onUpload: ButtonProps['onClick'];
}

export default function UploadLicense({
    error = '',
    isLoading,
    license,
    onChange,
    onErrorDismiss,
    onUpload
}: UploadLicenseProps) {
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
