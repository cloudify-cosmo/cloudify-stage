// @ts-nocheck File not migrated fully to TS
import type { FunctionComponent } from 'react';

export {};

interface Props {
    dataType: string;
    fileLoading: boolean;
    onChange: () => void;
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

Stage.defineCommon({
    name: 'YamlFileButton',
    common: YamlFileButton
});
