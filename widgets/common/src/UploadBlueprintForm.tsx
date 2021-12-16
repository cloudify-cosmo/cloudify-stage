// @ts-nocheck File not migrated fully to TS
import Consts from './Consts';

const t = Stage.Utils.getT('widgets.common.blueprintUpload.inputs');

class UploadBlueprintForm extends React.Component {
    static initialState = {
        loading: false,
        yamlFiles: []
    };

    static DEFAULT_BLUEPRINT_YAML_FILE = Consts.defaultBlueprintYamlFileName;

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
            uploadState,
            clearErrors
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
                yamlFileHelp={t('blueprintYamlFile.label')}
                onInputChange={this.handleInputChange}
                onErrorsDismiss={clearErrors}
                firstFormField={
                    <Form.Field
                        label={t('blueprintPackage.label')}
                        required
                        error={errors.blueprintUrl}
                        help={t('blueprintPackage.help')}
                    >
                        <Form.UrlOrFile
                            name="blueprint"
                            placeholder={t('blueprintPackage.placeholder')}
                            onChangeUrl={this.onBlueprintUrlChange}
                            onBlurUrl={this.onBlueprintUrlBlur}
                            onChangeFile={this.onBlueprintFileChange}
                        />
                    </Form.Field>
                }
                lastFormField={
                    <Form.Field label="Blueprint icon" error={errors.imageUrl} help={t('blueprintIcon.help')}>
                        <Form.UrlOrFile
                            name="image"
                            placeholder={t('blueprintIcon.placeholder')}
                            onChangeUrl={this.onBlueprintImageUrlChange}
                            onChangeFile={this.onBlueprintImageChange}
                        />
                    </Form.Field>
                }
            />
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
    uploadState: PropTypes.string,
    clearErrors: PropTypes.func
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
