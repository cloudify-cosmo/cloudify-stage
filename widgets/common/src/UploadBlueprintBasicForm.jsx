const { InProgressBlueprintStates, CompletedBlueprintStates } = Stage.Common.BlueprintActions;

const { i18n } = Stage;

const UploadLabels = _(InProgressBlueprintStates)
    .keyBy()
    .mapValues(value => i18n.t(`widgets.common.blueprintUpload.uploadLabels.${_.camelCase(value)}`))
    .value();

const UploadErrorHeaders = _([
    CompletedBlueprintStates.FailedUploading,
    CompletedBlueprintStates.FailedExtracting,
    CompletedBlueprintStates.FailedParsing
])
    .keyBy()
    .mapValues(value => i18n.t(`widgets.common.blueprintUpload.errorHeaders.${_.camelCase(value)}`))
    .value();

function UploadBlueprintBasicForm({
    blueprintName,
    blueprintUploading,
    blueprintYamlFile,
    errors,
    firstFormField,
    formLoading,
    lastFormField,
    onErrorsDismiss,
    onInputChange,
    uploadState,
    yamlFileHelp,
    yamlFiles
}) {
    const { Form, LoadingOverlay } = Stage.Basic;

    return (
        <Form
            loading={formLoading}
            errorMessageHeader={!_.isEmpty(errors) ? UploadErrorHeaders[uploadState] : null}
            errors={errors}
            onErrorsDismiss={onErrorsDismiss}
        >
            {blueprintUploading && <LoadingOverlay message={UploadLabels[uploadState]} />}
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
                    options={_.map(yamlFiles, item => {
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

UploadBlueprintBasicForm.propTypes = {
    blueprintName: PropTypes.string,
    blueprintUploading: PropTypes.bool,
    blueprintYamlFile: PropTypes.string,
    errors: PropTypes.shape({ blueprintName: PropTypes.string, blueprintYamlFile: PropTypes.string }),
    firstFormField: PropTypes.element,
    formLoading: PropTypes.bool,
    lastFormField: PropTypes.element,
    onErrorsDismiss: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    uploadState: PropTypes.string,
    yamlFiles: PropTypes.arrayOf(PropTypes.string),
    yamlFileHelp: PropTypes.string.isRequired
};

UploadBlueprintBasicForm.defaultProps = {
    blueprintName: '',
    blueprintUploading: false,
    blueprintYamlFile: '',
    errors: {},
    firstFormField: null,
    formLoading: false,
    lastFormField: null,
    uploadState: null,
    yamlFiles: null
};

Stage.defineCommon({
    name: 'UploadBlueprintBasicForm',
    common: UploadBlueprintBasicForm
});
