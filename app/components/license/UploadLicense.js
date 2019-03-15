/**
 * Created by jakub.niezgoda on 15/03/2019.
 */

import React from 'react';

import {Button, Form} from '../basic';

export default function UploadLicense({error, isLoading, license, onChange, onErrorDismiss, onUpload}) {
    return (
        <Form errors={error} errorMessageHeader='License error' onErrorsDismiss={onErrorDismiss}>
            <Form.TextArea name='license' autoHeight placeholder='License in YAML format' error={!!error}
                           value={license} onChange={onChange} disabled={isLoading} />

            <Button content='Upload' icon='upload' color='yellow' labelPosition='left'
                    disabled={_.isEmpty(license)} loading={isLoading} onClick={onUpload} />
        </Form>
    );
}