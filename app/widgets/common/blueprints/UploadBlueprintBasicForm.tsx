import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { DropdownProps, InputProps } from 'semantic-ui-react';
import { camelCase, isEmpty, map } from 'lodash';
import i18n from 'i18next';
import { CompletedBlueprintStates, InProgressBlueprintStates } from './BlueprintActions';
import { Form, LoadingOverlay } from '../../../components/basic';

export interface UploadBlueprintBasicFormProps {
    blueprintName?: string;
    blueprintUploading?: boolean;
    blueprintYamlFile?: string;
    errors?: { blueprintName?: string; blueprintYamlFile?: string };
    firstFormField?: ReactNode;
    formLoading?: boolean;
    lastFormField?: ReactNode;
    onErrorsDismiss: () => void;
    onInputChange: (InputProps & DropdownProps)['onChange'];
    uploadState?: string;
    yamlFiles?: string[];
    yamlFileHelp: string;
}

export default function UploadBlueprintBasicForm({
    blueprintName = '',
    blueprintUploading,
    blueprintYamlFile = '',
    errors = {},
    firstFormField = null,
    formLoading,
    lastFormField = null,
    onErrorsDismiss,
    onInputChange,
    uploadState = '',
    yamlFileHelp,
    yamlFiles
}: UploadBlueprintBasicFormProps) {
    const uploadLabels = useMemo(
        () =>
            _(InProgressBlueprintStates)
                .keyBy()
                .mapValues(value => i18n.t(`widgets.common.blueprintUpload.uploadLabels.${camelCase(value)}`))
                .value(),
        []
    );

    const uploadErrorHeaders = useMemo(
        () =>
            _([
                CompletedBlueprintStates.FailedUploading,
                CompletedBlueprintStates.FailedExtracting,
                CompletedBlueprintStates.FailedParsing
            ])
                .keyBy()
                .mapValues(value => i18n.t(`widgets.common.blueprintUpload.errorHeaders.${camelCase(value)}`))
                .value(),
        []
    );

    return (
        <Form
            loading={formLoading}
            errorMessageHeader={!isEmpty(errors) ? uploadErrorHeaders[uploadState] : undefined}
            errors={errors}
            onErrorsDismiss={onErrorsDismiss}
        >
            {blueprintUploading && <LoadingOverlay message={uploadLabels[uploadState]} />}
            {firstFormField}
            <Form.Field
                label={i18n.t(`widgets.common.blueprintUpload.inputs.blueprintName.label`)}
                required
                error={errors.blueprintName}
                help={i18n.t(`widgets.common.blueprintUpload.inputs.blueprintName.help`)}
            >
                <Form.Input name="blueprintName" value={blueprintName} onChange={onInputChange} />
            </Form.Field>
            <Form.Field
                label={i18n.t(`widgets.common.blueprintUpload.inputs.blueprintYamlFile.label`)}
                required
                error={errors.blueprintYamlFile}
                help={yamlFileHelp}
            >
                <Form.Dropdown
                    name="blueprintYamlFile"
                    search
                    selection
                    options={map(yamlFiles, item => {
                        return { text: item, value: item };
                    })}
                    value={blueprintYamlFile}
                    onChange={onInputChange}
                />
            </Form.Field>
            {lastFormField}
        </Form>
    );
}
