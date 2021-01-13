const { InProgressBlueprintStates, CompletedBlueprintStates } = Stage.Common.BlueprintActions;

const UploadLabels = _(InProgressBlueprintStates)
    .keyBy()
    .mapValues(value => Stage.i18n.t(`widgets.common.blueprintUpload.uploadLabels.${_.camelCase(value)}`))
    .value();

const UploadErrorHeaders = _([
    CompletedBlueprintStates.FailedUploading,
    CompletedBlueprintStates.FailedExtracting,
    CompletedBlueprintStates.FailedParsing
])
    .keyBy()
    .mapValues(value => Stage.i18n.t(`widgets.common.blueprintUpload.errorHeaders.${_.camelCase(value)}`))
    .value();

function UploadBlueprintBasicForm({
    blueprintName,
    blueprintUploading,
    blueprintYamlFile,
    children,
    errors,
    formLoading,
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
            {_.head(children)}
            <Form.Field
                label={Stage.i18n.t(`widgets.common.blueprintUpload.inputs.blueprintName.label`)}
                required
                error={errors.blueprintName}
                help={Stage.i18n.t(`widgets.common.blueprintUpload.inputs.blueprintName.help`)}
            >
                <Form.Input name="blueprintName" value={blueprintName} onChange={onInputChange} />
            </Form.Field>
            <Form.Field
                label={Stage.i18n.t(`widgets.common.blueprintUpload.inputs.blueprintYamlFile.label`)}
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
            {_.tail(children)}
        </Form>
    );
}

UploadBlueprintBasicForm.propTypes = {
    blueprintName: PropTypes.string,
    blueprintUploading: PropTypes.bool,
    blueprintYamlFile: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element),
    errors: PropTypes.shape({ blueprintName: PropTypes.string, blueprintYamlFile: PropTypes.string }),
    formLoading: PropTypes.bool,
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
    children: null,
    errors: {},
    formLoading: false,
    uploadState: null,
    yamlFiles: null
};

Stage.defineCommon({
    name: 'UploadBlueprintBasicForm',
    common: UploadBlueprintBasicForm
});
