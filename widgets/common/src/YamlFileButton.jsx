/**
 * Created by jakubniezgoda on 05/07/2018.
 */

function YamlFileButton({ dataType, fileLoading, onChange }) {
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

YamlFileButton.propTypes = {
    dataType: PropTypes.string,
    fileLoading: PropTypes.bool,
    onChange: PropTypes.func
};

YamlFileButton.defaultProps = {
    dataType: 'values',
    fileLoading: false,
    onChange: _.noop
};

Stage.defineCommon({
    name: 'YamlFileButton',
    common: YamlFileButton
});
