/**
 * Created by jakub.niezgoda on 17/08/2018.
 */

class UploadPluginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        wagonUrl: PropTypes.string,
        wagonFile: PropTypes.object,
        wagonPlaceholder: PropTypes.string,
        yamlUrl: PropTypes.string,
        yamlFile: PropTypes.object,
        yamlPlaceholder: PropTypes.string,
        errors: PropTypes.object,
        loading: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        wrapInForm: PropTypes.bool,
        addRequiredMarks: PropTypes.bool
    };

    static defaultProps = {
        wagonUrl: '',
        wagonFile: null,
        wagonPlaceholder: "Provide the plugin's wagon file URL or click browse to select a file",
        yamlUrl: '',
        yamlFile: null,
        yamlPlaceholder: "Provide the plugin's YAML file URL or click browse to select a file",
        errors: {},
        loading: false,
        wrapInForm: true,
        addRequiredMarks: true
    };

    static NO_ERRORS = { errors: {} };

    componentDidMount() {
        this.resetErrors();
    }

    resetErrors() {
        this.props.onChange(UploadPluginForm.NO_ERRORS);
    }

    _onWagonFileChange(file) {
        this.props.onChange({
            ...UploadPluginForm.NO_ERRORS,
            wagonFile: file || null,
            wagonUrl: file ? file.name : ''
        });
    }

    _onYamlFileChange(file) {
        this.props.onChange({
            ...UploadPluginForm.NO_ERRORS,
            yamlFile: file || null,
            yamlUrl: file ? file.name : ''
        });
    }

    onWagonUrlChange(wagonUrl) {
        this.props.onChange({
            ...UploadPluginForm.NO_ERRORS,
            wagonFile: null,
            wagonUrl
        });
    }

    onYamlUrlChange(yamlUrl) {
        this.props.onChange({
            ...UploadPluginForm.NO_ERRORS,
            yamlFile: null,
            yamlUrl
        });
    }

    render() {
        const { Container, Form, Label } = Stage.Basic;

        const formFields = [
            <Form.Field
                label="Wagon file"
                required={this.props.addRequiredMarks}
                key="wagon"
                error={this.props.errors.wagonUrl}
            >
                <Form.UrlOrFile
                    name="wagon"
                    value={this.props.wagonUrl}
                    placeholder={this.props.wagonPlaceholder}
                    onChangeUrl={this.onWagonUrlChange.bind(this)}
                    onChangeFile={this._onWagonFileChange.bind(this)}
                />
            </Form.Field>,
            <Form.Field
                label="YAML file"
                required={this.props.addRequiredMarks}
                key="yaml"
                error={this.props.errors.yamlUrl}
            >
                <Form.UrlOrFile
                    name="yaml"
                    value={this.props.yamlUrl}
                    placeholder={this.props.yamlPlaceholder}
                    onChangeUrl={this.onYamlUrlChange.bind(this)}
                    onChangeFile={this._onYamlFileChange.bind(this)}
                />
            </Form.Field>
        ];

        if (this.props.wrapInForm) {
            return (
                <Form
                    errors={this.props.errors}
                    onErrorsDismiss={this.resetErrors.bind(this)}
                    loading={this.props.loading}
                >
                    {formFields}
                </Form>
            );
        }
        return <Container fluid>{formFields}</Container>;
    }
}

Stage.defineCommon({
    name: 'UploadPluginForm',
    common: UploadPluginForm
});
