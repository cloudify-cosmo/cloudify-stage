/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button, ErrorMessage, Form, Segment } from '../basic';

export default function UploadLicense({ error, isLoading, license, onChange, onErrorDismiss, onUpload }) {
    return (
        <Segment>
            <Form errors={error} errorMessageHeader="License error" onErrorsDismiss={onErrorDismiss}>
                <Form.TextArea
                    name="license"
                    autoHeight
                    error={!!error}
                    placeholder="Paste the complete license string,
                                            including the license signature"
                    value={license}
                    onChange={onChange}
                    disabled={isLoading}
                />

                <Button
                    content="Update"
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
