import type { FunctionComponent } from 'react';

interface Props {
    dataType: string;
    fileLoading: boolean;
    onChange: (file: File) => void;
    iconButton?: boolean;
}

const YamlFileButton: FunctionComponent<Props> = ({
    dataType = 'values',
    fileLoading = false,
    onChange = _.noop,
    iconButton = false
}) => {
    const { Form } = Stage.Basic;

    const openButtonParams = iconButton
        ? { floated: 'right' }
        : { floated: 'right', content: 'Load Values', labelPosition: 'left' };

    return (
        <Form.File
            name="yamlFile"
            showInput={false}
            showReset={false}
            openButtonParams={openButtonParams}
            onChange={onChange}
            help={`You can provide YAML file with ${dataType} to automatically fill in the form.`}
            loading={fileLoading}
            disabled={fileLoading}
        />
    );
};

export default YamlFileButton;

declare global {
    namespace Stage.Common {
        export { YamlFileButton };
    }
}

Stage.defineCommon({
    name: 'YamlFileButton',
    common: YamlFileButton
});
