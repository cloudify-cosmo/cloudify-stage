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
        blueprintFile: PropTypes.object,
        blueprintName: PropTypes.string,
        blueprintFileName: PropTypes.string,
        imageUrl: PropTypes.string,
        imageFile: PropTypes.object,
        errors: PropTypes.object,
        loading: PropTypes.bool,
        showErrorsSummary: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        toolbox: PropTypes.object.isRequired
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
        this.setState(UploadBlueprintForm.initialState);

        if (
            (!_.isEmpty(this.props.blueprintUrl) && Stage.Utils.Url.isUrl(this.props.blueprintUrl)) ||
            !_.isNil(this.props.blueprintFile)
        ) {
            this.setState({ loading: true });
            this.actions
                .doListYamlFiles(this.props.blueprintUrl, this.props.blueprintFile, false)
                .then(data => {
                    this.setState({ yamlFiles: data, loading: false });
                })
                .catch(error => {
                    this.setState({ yamlFiles: [], loading: false });
                    this.props.onChange({ errors: { error } });
                });
        }
    }

    handleInputChange(proxy, field) {
        this.props.onChange({ ...UploadBlueprintForm.NO_ERRORS, ...Stage.Basic.Form.fieldNameValue(field) });
    }

    onBlueprintUrlBlur() {
        if (_.isEmpty(this.props.blueprintUrl) || !Stage.Utils.Url.isUrl(this.props.blueprintUrl)) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            return;
        }

        this.setState({ loading: true }, () => this.props.onChange({ blueprintFile: null }));

        this.actions
            .doListYamlFiles(this.props.blueprintUrl, null, true)
            .then(data => {
                this.setState({ yamlFiles: data, loading: false }, () => {
                    const blueprintName = data.shift();
                    const blueprintFileName = _.includes(data, UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE)
                        ? UploadBlueprintForm.DEFAULT_BLUEPRINT_YAML_FILE
                        : data[0];
                    this.props.onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintName, blueprintFileName });
                });
            })
            .catch(error => {
                this.setState({ loading: false }, () =>
                    this.props.onChange({ errors: { error: error.message }, blueprintName: '', blueprintFileName: '' })
                );
            });
    }

    onBlueprintFileChange(file) {
        if (!file) {
            this.setState({ yamlFiles: [] }, this.resetErrors);
            if (this.props.blueprintFile) {
                this.props.onChange({
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
                    this.props.onChange({
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
                    this.props.onChange({ errors: { error: error.message }, blueprintName: '', blueprintFileName: '' })
                );
            });
    }

    onBlueprintImageChange(file) {
        if (file) {
            this.props.onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl: file.name, imageFile: file });
        }
    }

    onBlueprintUrlChange(blueprintUrl) {
        this.props.onChange({ ...UploadBlueprintForm.NO_ERRORS, blueprintUrl, blueprintFile: null });
    }

    onBlueprintImageUrlChange(imageUrl) {
        this.props.onChange({ ...UploadBlueprintForm.NO_ERRORS, imageUrl, imageFile: null });
    }

    resetErrors() {
        this.props.onChange(UploadBlueprintForm.NO_ERRORS);
    }

    render() {
        const { Form, Label } = Stage.Basic;
        const options = _.map(this.state.yamlFiles, item => {
            return { text: item, value: item };
        });

        return (
            <Form
                loading={this.state.loading || this.props.loading}
                errors={this.props.showErrorsSummary ? this.props.errors : null}
                onErrorsDismiss={this.resetErrors.bind(this)}
            >
                <Form.Field
                    label="Blueprint package"
                    required
                    error={this.props.errors.blueprintUrl}
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
                    error={this.props.errors.blueprintName}
                    help="The package is uploaded to the Manager as a blueprint with the name you specify here."
                >
                    <Form.Input
                        name="blueprintName"
                        value={this.props.blueprintName}
                        onChange={this.handleInputChange.bind(this)}
                    />
                </Form.Field>

                <Form.Field
                    label="Blueprint YAML file"
                    required
                    error={this.props.errors.blueprintFileName}
                    help="If you choose archive as blueprint package, you must specify
                                  the blueprint YAML file for your environment,
                                  because the archive can contain more than one YAML file."
                >
                    <Form.Dropdown
                        name="blueprintFileName"
                        search
                        selection
                        options={options}
                        value={this.props.blueprintFileName}
                        onChange={this.handleInputChange.bind(this)}
                    />
                </Form.Field>

                <Form.Field
                    label="Blueprint icon"
                    error={this.props.errors.imageUrl}
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
