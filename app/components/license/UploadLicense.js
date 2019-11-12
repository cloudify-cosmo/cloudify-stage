/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';

import { Button, Form, Segment } from '../basic';

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
