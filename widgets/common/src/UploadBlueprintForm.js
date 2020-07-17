/**
 * Created by kinneretzin on 05/10/2016.
 */

class UploadBlueprintForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = UploadBlueprintForm.initialState;

        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static propTypes = {
        blueprintUrl: PropTypes.string,
        blueprintFile: PropTypes.shape({}),
        blueprintName: PropTypes.string,
        blueprintFileName: PropTypes.string,
        imageUrl: PropTypes.string,
        imageFile: PropTypes.shape({}),
        errors: PropTypes.shape({
            blueprintFileName: PropTypes.string,
            blueprintName: PropTypes.string,
            blueprintUrl: PropTypes.string,
            imageUrl: PropTypes.string
        }),
        loading: PropTypes.bool,
        showErrorsSummary: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        toolbox: Stage.Common.PropTypes.Toolbox.isRequired
    };

    static defaultProps = {
        blueprintUrl: '',
        blueprintFile: null,
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        imageFile: null,
        errors: {},
        loading: false,
        showErrorsSummary: true
    };

    static initialState = {
        loading: false,
        yamlFiles: []
    };

    static DEFAULT_BLUEPRINT_YAML_FILE = 'blueprint.yaml';

    static NO_ERRORS = { errors: {} };

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

    handleInputChange(proxy, field) {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    onBlueprintUrlBlur() {
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
                    const blueprintFileName = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                        ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                        : data[0];
                    onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintName, blueprintFileName });
                });
            })
            .catch(error => {
                this.setState({ loading: false }, () =>
                    onChange({ errors: { error: error.message }, blueprintName: '', blueprintFileName: '' })
                );
            });
    }

    onBlueprintFileChange(file) {
        const { blueprintFile, onChange } = this.props;
        if (!file) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            if (blueprintFile) {
                onChange({
                    blueprintFile: null,
                    blueprintUrl: '',
                    blueprintName: '',
                    blueprintFileName: ''
                });
            }
            return;
        }

        this.setState({ loading: true });
        this.actions
            .doListYamlFiles(null, file, true)
            .then(data => {
                const blueprintName = data.shift();
                const blueprintFileName = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                    ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                    : data[0];
                this.setState({ yamlFiles: data, loading: false }, () => {
                    onChange({
                        ...UploadBlueprintForm.NO_ERRORS,
                        blueprintFile: file,
                        blueprintUrl: file.name,
                        blueprintName,
                        blueprintFileName
                    });
                });
            })
            .catch(error => {
                this.setState({ loading: false }, () =>
                    onChange({ errors: { error: error.message }, blueprintName: '', blueprintFileName: '' })
                );
            });
    }

    onBlueprintImageChange(file) {
        if (file) {
            const { onChange } = this.props;
            onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl: file.name, imageFile: file });
        }
    }

    onBlueprintUrlChange(blueprintUrl) {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintUrl, blueprintFile: null });
    }

    onBlueprintImageUrlChange(imageUrl) {
        const { onChange } = this.props;
        onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl, imageFile: null });
    }

    resetErrors() {
        const { onChange } = this.props;
        onChange(UploadBlueprintForm.NO_ERRORS);
    }

    render() {
        const { loading: loadingState, yamlFiles } = this.state;
        const { blueprintFileName, blueprintName, errors, loading: loadingProp, showErrorsSummary } = this.props;
        const { Form, Label } = Stage.Basic;
        const options = _.map(yamlFiles, item => {
            return { text: item, value: item };
        });

        return (
            <Form
                loading={loadingState || loadingProp}
                errors={showErrorsSummary ? errors : null}
                onErrorsDismiss={this.resetErrors.bind(this)}
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
                        onChangeUrl={this.onBlueprintUrlChange.bind(this)}
                        onBlurUrl={this.onBlueprintUrlBlur.bind(this)}
                        onChangeFile={this.onBlueprintFileChange.bind(this)}
                    />
                </Form.Field>

                <Form.Field
                    label="Blueprint name"
                    required
                    error={errors.blueprintName}
                    help="The package is uploaded to the Manager as a blueprint with the name you specify here."
                >
                    <Form.Input
                        name="blueprintName"
                        value={blueprintName}
                        onChange={this.handleInputChange.bind(this)}
                    />
                </Form.Field>

                <Form.Field
                    label="Blueprint YAML file"
                    required
                    error={errors.blueprintFileName}
                    help="If you choose archive as blueprint package, you must specify
                                  the blueprint YAML file for your environment,
                                  because the archive can contain more than one YAML file."
                >
                    <Form.Dropdown
                        name="blueprintFileName"
                        search
                        selection
                        options={options}
                        value={blueprintFileName}
                        onChange={this.handleInputChange.bind(this)}
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
                        onChangeUrl={this.onBlueprintImageUrlChange.bind(this)}
                        onChangeFile={this.onBlueprintImageChange.bind(this)}
                    />
                </Form.Field>
            </Form>
        );
    }
}

Stage.defineCommon({
    name: 'UploadBlueprintForm',
    common: UploadBlueprintForm
});
