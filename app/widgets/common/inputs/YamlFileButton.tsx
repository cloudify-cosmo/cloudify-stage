import type { ButtonHTMLAttributes, FunctionComponent } from 'react';
import React from 'react';
import type { StrictButtonProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { Form } from '../../../components/basic';

export interface Props {
    dataType: string;
    fileLoading: boolean;
    onChange: (file: File) => void;
    iconButton?: boolean;
}

const SimpleFileButton = styled(Form.File)`
    && {
        box-shadow: 'none';
        background: 'none';
        padding: 0;
    }
`;

const YamlFileButton: FunctionComponent<Props> = ({
    dataType = 'values',
    fileLoading = false,
    onChange = _.noop,
    iconButton = false
}) => {
    /*
    box-shadow: none !important;
    background: none !important;
    padding: 0;
     */
    const openButtonParams: StrictButtonProps = iconButton
        ? {
              floated: 'right',
              color: 'blue',
              size: 'large',
              basic: true
          }
        : {
              floated: 'right',
              color: 'blue',
              content: 'Load Values',
              labelPosition: 'left'
          };

    return (
        <SimpleFileButton
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
