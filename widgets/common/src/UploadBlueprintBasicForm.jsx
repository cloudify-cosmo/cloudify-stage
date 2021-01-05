const { InProgressBlueprintStates, CompletedBlueprintStates } = Stage.Common.BlueprintActions;

const UploadLabels = {
    [InProgressBlueprintStates.Pending]: '0/4: Waiting for blueprint upload to start...',
    [InProgressBlueprintStates.Uploading]: '1/4: Uploading blueprint...',
    [InProgressBlueprintStates.Extracting]: '2/4: Extracting blueprint...',
    [InProgressBlueprintStates.Parsing]: '3/4: Parsing blueprint...',
    [InProgressBlueprintStates.UploadingImage]: '4/4: Uploading image...'
};

const UploadErrorHeaders = {
    [CompletedBlueprintStates.FailedUploading]: 'Blueprint upload failed',
    [CompletedBlueprintStates.FailedExtracting]: 'Blueprint extraction failed',
    [CompletedBlueprintStates.FailedParsing]: 'Blueprint parsing failed'
};

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
        <>
            <Form
                loading={formLoading}
                errorMessageHeader={!_.isEmpty(errors) ? UploadErrorHeaders[uploadState] : null}
                errors={errors}
                onErrorsDismiss={onErrorsDismiss}
            >
                {blueprintUploading && <LoadingOverlay message={UploadLabels[uploadState]} />}
                {children && children[0]}
                <Form.Field
                    label="Blueprint name"
                    required
                    error={errors.blueprintName}
                    help="The package will be uploaded to the Manager as a Blueprint resource,
                                              under the name you specify here."
                >
                    <Form.Input name="blueprintName" value={blueprintName} onChange={onInputChange} />
                </Form.Field>
                <Form.Field label="Blueprint YAML file" required error={errors.blueprintYamlFile} help={yamlFileHelp}>
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
                {children && children[1]}
            </Form>
        </>
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
