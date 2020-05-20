/**
 * Created by jakubniezgoda on 05/07/2018.
 */

class YamlFileButton extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        dataType: PropTypes.string,
        fileLoading: PropTypes.bool,
        onChange: PropTypes.func
    };

    static defaultProps = {
        dataType: 'values',
        fileLoading: false,
        onChange: _.noop
    };

    render() {
        const { dataType, fileLoading, onChange } = this.props;
        const { Form } = Stage.Basic;

        return (
            <Form.File
                name="yamlFile"
                showInput={false}
                showReset={false}
                openButtonParams={{ className: 'rightFloated', content: 'Load Values', labelPosition: 'left' }}
                onChange={onChange}
                help={`You can provide YAML file with ${dataType} to automatically fill in the form.`}
                loading={fileLoading}
                disabled={fileLoading}
            />
        );
    }
}

Stage.defineCommon({
    name: 'YamlFileButton',
    common: YamlFileButton
});
