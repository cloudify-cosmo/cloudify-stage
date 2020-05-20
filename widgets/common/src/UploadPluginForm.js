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
        const { onChange: cbOnChange } = this.props;
        cbOnChange(UploadPluginForm.NO_ERRORS);
    }

    onChange(field, file, url) {
        const { onChange: cbOnChange } = this.props;
        cbOnChange({
            ...UploadPluginForm.NO_ERRORS,
            [`${field}File`]: file,
            [`${field}Url`]: url
        });
    }

    createFormField(field, required) {
        const { errors, hidePlaceholders } = this.props;
        const { Form } = Stage.Basic;
        const fieldName = field.toLowerCase();
        const urlProp = `${fieldName}Url`;
        return (
            <Form.Field label={`${field} file`} required={required} key={field} error={errors[urlProp]}>
                <Form.UrlOrFile
                    name={fieldName}
                    value={urlProp}
                    placeholder={hidePlaceholders ? '' : placeholders[fieldName]}
                    onChangeUrl={url => this.onChange(fieldName, null, url)}
                    onChangeFile={file => this.onChange(fieldName, file || null, file ? file.name : '')}
                />
            </Form.Field>
        );
    }

    render() {
        const { addRequiredMarks, errors, loading, wrapInForm } = this.props;
        const { Container, Form } = Stage.Basic;

        const formFields = [
            this.createFormField('Wagon', addRequiredMarks),
            this.createFormField('YAML', addRequiredMarks),
            this.createFormField('Icon', false)
        ];

        if (wrapInForm) {
            return (
                <Form errors={errors} onErrorsDismiss={this.resetErrors.bind(this)} loading={loading}>
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
