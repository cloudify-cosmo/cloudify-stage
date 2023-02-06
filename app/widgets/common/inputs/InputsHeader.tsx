import type { FunctionComponent } from 'react';
import React from 'react';
import { Form, Header, PopupHelp } from '../../../components/basic';
import InputsHelpDescription from './InputsHelpDescription';
import stageUtils from '../../../utils/stageUtils';

const translate = stageUtils.getT('widgets.common.deployments.deployModal.inputs.header');

export interface InputsHeaderProps {
    compact?: boolean;
    dividing?: boolean;
    header?: string;
}

const InputsHeader: FunctionComponent<InputsHeaderProps> = React.memo(
    ({ compact = false, dividing = true, header = translate('label') }) => {
        const HeaderWithDescription = () => (
            <Header size="tiny">
                {header}
                <Header.Subheader>
                    {translate('subHeader')}
                    <PopupHelp flowing header={translate('popupHelp')} content={<InputsHelpDescription />} />
                </Header.Subheader>
            </Header>
        );

        return dividing ? (
            <Form.Divider style={compact ? { marginTop: 0 } : {}}>
                <HeaderWithDescription />
            </Form.Divider>
        ) : (
            <HeaderWithDescription />
        );
    }
);

export default InputsHeader;
