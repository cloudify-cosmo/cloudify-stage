import { noop } from 'lodash';
import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import stageUtils from '../../../utils/stageUtils';
import { Form } from '../../../components/basic';

const translate = stageUtils.getT('widgets.common.inputs.buttons.yamlFile');

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

const YamlFileButton: FunctionComponent<Props> = ({
    dataType = translate('dataType'),
    fileLoading = false,
    onChange = noop
}) => {
    return (
        <BasicButtonContainer>
            <Form.File
                name="yamlFile"
                showInput={false}
                showReset={false}
                onChange={onChange}
                help={translate('help', { dataType })}
                loading={fileLoading}
                disabled={fileLoading}
            />
        </BasicButtonContainer>
    );
};

export default YamlFileButton;
