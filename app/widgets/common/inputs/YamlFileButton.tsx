import type { FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import styled from 'styled-components';
import { Form } from '../../../components/basic';

const BasicButtonContainer = styled.div`
    &&&&&& button {
        padding: 0;
        box-shadow: none !important;
        background: none !important;
    }
`;

export interface Props {
    dataType: string;
    fileLoading: boolean;
    onChange: (file: File) => void;
}

const YamlFileButton: FunctionComponent<Props> = ({ dataType = 'values', fileLoading = false, onChange = _.noop }) => {
    return (
        <BasicButtonContainer>
            <Form.File
                name="yamlFile"
                showInput={false}
                showReset={false}
                openButtonParams={{
                    color: 'blue',
                    size: 'huge',
                    basic: true,
                    icon: {
                        link: true,
                        name: 'open folder'
                    }
                }}
                onChange={onChange}
                help={i18n.t('widgets.common.inputs.buttons.yamlFile.help', { dataType })}
                loading={fileLoading}
                disabled={fileLoading}
            />
        </BasicButtonContainer>
    );
};

export default YamlFileButton;
