/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadBlueprintForm extends React.Component {
    static initialState = {
        loading: false,
        yamlFiles: []
    };

    static DEFAULT_BLUEPRINT_YAML_FILE = 'blueprint.yaml';

    static NO_ERRORS = { errors: {} };

    constructor(props) {
        super(props);

        this.state = UploadBlueprintForm.initialState;

        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    componentDidMount() {
        const { blueprintFile, blueprintUrl, onChange } = this.props;
        this.setState(UploadBlueprintForm.initialState);

        if ((!_.isEmpty(blueprintUrl) && Stage.Utils.Url.isUrl(blueprintUrl)) || !_.isNil(blueprintFile)) {
            this.setState({ loading: true });
            this.actions
                .doListYamlFiles(blueprintUrl, blueprintFile, false)
                .then(data => {
                    this.setState({ yamlFiles: data, loading: false });
                })
                .catch(error => {
                    this.setState({ yamlFiles: [], loading: false });
                    onChange({ errors: { error } });
                });
        }
    }

    onBlueprintUrlBlur = () => {
        const { blueprintUrl, onChange } = this.props;
        if (_.isEmpty(blueprintUrl) || !Stage.Utils.Url.isUrl(blueprintUrl)) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            return;
        }

        this.setState({ loading: true }, () => onChange({ blueprintFile: null }));

        this.actions
            .doListYamlFiles(blueprintUrl, null, true)
            .then(data => {
                this.setState({ yamlFiles: data, loading: false }, () => {
                    const blueprintName = data.shift();
                    const blueprintYamlFile = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                        ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                        : data[0];
                    onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintName, blueprintYamlFile });
                });
            })
            .catch(error => {
                this.setState({ loading: false }, () =>
                    onChange({ errors: { error: error.message }, blueprintName: '', blueprintYamlFile: '' })
                );
            });
    };

    onBlueprintFileChange = file => {
        const { blueprintFile, onChange } = this.props;
        if (!file) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            if (blueprintFile) {
                onChange({
                    blueprintFile: null,
                    blueprintUrl: '',
                    blueprintName: '',
                    blueprintYamlFile: ''
                });
            }
            return;
        }

        this.setState({ loading: true });
        this.actions
            .doListYamlFiles(null, file, true)
            .then(data => {
                const blueprintName = data.shift();
                const blueprintYamlFile = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                    ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                    : data[0];
                this.setState({ yamlFiles: data, loading: false }, () => {
                    onChange({
                        ...UploadBlueprintForm.NO_ERRORS,
                        blueprintFile: file,
                        blueprintUrl: file.name,
                        blueprintName,
                        blueprintYamlFile
                    });
                });
            })
            .catch(error => {
                this.setState({ loading: false }, () =>
                    onChange({ errors: { error: error.message }, blueprintName: '', blueprintYamlFile: '' })
                );
            });
    };

    onBlueprintImageChange = file => {
        if (file) {
            const { onChange } = this.props;
            onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl: file.name, imageFile: file });
        }
    };

    onBlueprintUrlChange = blueprintUrl => {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintUrl, blueprintFile: null });
    };

    onBlueprintImageUrlChange = imageUrl => {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl, imageFile: null });
    };

    handleInputChange = (proxy, field) => {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, ...Stage.Basic.Form.fieldNameValue(field) });
    };

    resetErrors = () => {
        const { onChange } = this.props;
        onChange(UploadBlueprintForm.NO_ERRORS);
    };

    render() {
        const { loading: loadingState, yamlFiles } = this.state;
        const {
            blueprintYamlFile,
            blueprintName,
            errors,
            loading: loadingProp,
            showErrorsSummary,
            uploadState
        } = this.props;
        const { Form } = Stage.Basic;
        const { UploadBlueprintBasicForm } = Stage.Common;

        return (
            <UploadBlueprintBasicForm
                errors={showErrorsSummary ? errors : {}}
                blueprintYamlFile={blueprintYamlFile}
                blueprintName={blueprintName}
                yamlFiles={yamlFiles}
                uploadState={uploadState}
                formLoading={loadingState}
                blueprintUploading={loadingProp}
                yamlFileHelp="If you choose archive as blueprint package, you must specify
                                  the blueprint YAML file for your environment,
                                  because the archive can contain more than one YAML file."
                onInputChange={this.handleInputChange}
                onErrorsDismiss={this.resetErrors}
            >
                <Form.Field
                    label="Blueprint package"
                    required
                    error={errors.blueprintUrl}
                    help="You can provide single YAML file or blueprint archive.
                                  Supported types are: yml, yaml, zip, tar, tar.gz and tar.bz2.
                                  The archive package must contain exactly one directory
                                  that includes at least one YAML file."
                >
                    <Form.UrlOrFile
                        name="blueprint"
                        placeholder="Provide the blueprint's URL or click browse to select a file"
                        onChangeUrl={this.onBlueprintUrlChange}
                        onBlurUrl={this.onBlueprintUrlBlur}
                        onChangeFile={this.onBlueprintFileChange}
                    />
                </Form.Field>
                <Form.Field
                    label="Blueprint icon"
                    error={errors.imageUrl}
                    help="(Optional) The blueprint icon file is shown with the blueprint in the local blueprint widget."
                >
                    <Form.UrlOrFile
                        name="image"
                        placeholder="Provide the image file URL or click browse to select a file"
                        onChangeUrl={this.onBlueprintImageUrlChange}
                        onChangeFile={this.onBlueprintImageChange}
                    />
                </Form.Field>
            </UploadBlueprintBasicForm>
        );
    }
}

UploadBlueprintForm.propTypes = {
    blueprintUrl: PropTypes.string,
    blueprintFile: PropTypes.shape({}),
    blueprintName: PropTypes.string,
    blueprintYamlFile: PropTypes.string,
    imageUrl: PropTypes.string,
    imageFile: PropTypes.shape({}),
    errors: PropTypes.shape({
        blueprintYamlFile: PropTypes.string,
        blueprintName: PropTypes.string,
        blueprintUrl: PropTypes.string,
        imageUrl: PropTypes.string
    }),
    loading: PropTypes.bool,
    showErrorsSummary: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    uploadState: PropTypes.string
};

UploadBlueprintForm.defaultProps = {
    blueprintUrl: '',
    blueprintFile: null,
    blueprintName: '',
    blueprintYamlFile: '',
    imageUrl: '',
    imageFile: null,
    errors: {},
    loading: false,
    showErrorsSummary: true,
    uploadState: null
};

Stage.defineCommon({
    name: 'UploadBlueprintForm',
    common: UploadBlueprintForm
});
