/**
 * Created by jakub.niezgoda on 17/08/2018.
 */

const placeholders = {
    wagon: "Provide the plugin's wagon file URL or click browse to select a file",
    yaml: "Provide the plugin's YAML file URL or click browse to select a file",
    icon: "Provide the plugin's icon file URL or click browse to select a file"
};

class UploadPluginForm extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        wagonUrl: PropTypes.string,
        yamlUrl: PropTypes.string,
        iconUrl: PropTypes.string,
        errors: PropTypes.object,
        loading: PropTypes.bool,
        onChange: PropTypes.func.isRequired,
        wrapInForm: PropTypes.bool,
        addRequiredMarks: PropTypes.bool,
        hidePlaceholders: PropTypes.bool
    };

    static defaultProps = {
        wagonUrl: '',
        yamlUrl: '',
        iconUrl: '',
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

    onChange(field, file, url) {
        this.props.onChange({
            ...UploadPluginForm.NO_ERRORS,
            [`${field}File`]: file,
            [`${field}Url`]: url
        });
    }

    createFormField(field, required) {
        const { Form } = Stage.Basic;
        const fieldName = field.toLowerCase();
        const urlProp = `${fieldName}Url`;
        return (
            <Form.Field label={`${field} file`} required={required} key={field} error={this.props.errors[urlProp]}>
                <Form.UrlOrFile
                    name={fieldName}
                    value={this.props[urlProp]}
                    placeholder={this.props.hidePlaceholders ? '' : placeholders[fieldName]}
                    onChangeUrl={url => this.onChange(fieldName, null, url)}
                    onChangeFile={file => this.onChange(fieldName, file || null, file ? file.name : '')}
                />
            </Form.Field>
        );
    }

    render() {
        const { Container, Form } = Stage.Basic;

        const formFields = [
            this.createFormField('Wagon', this.props.addRequiredMarks),
            this.createFormField('YAML', this.props.addRequiredMarks),
            this.createFormField('Icon', false)
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
