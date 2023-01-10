import type { FunctionComponent } from 'react';
import React from 'react';
import type { StrictButtonProps } from 'semantic-ui-react';
import { Form } from '../../../components/basic';

export interface Props {
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
    const openButtonParams: StrictButtonProps = iconButton
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
