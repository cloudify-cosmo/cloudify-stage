import type { FunctionComponent } from 'react';
import React from 'react';
import { Form, Header, PopupHelp } from '../../../components/basic';
import InputsHelpDescription from './InputsHelpDescription';

export interface InputsHeaderProps {
    iconButton?: boolean;
    compact?: boolean;
    dividing?: boolean;
    header?: string;
}

const InputsHeader: FunctionComponent<InputsHeaderProps> = React.memo(
    ({ compact = false, dividing = true, header = 'Deployment inputs' }) => {
        const HeaderWithDescription = () => (
            <Header size="tiny">
                {header}
                <Header.Subheader>
                    See values typing details:&nbsp;
                    <PopupHelp flowing header="Value type" content={<InputsHelpDescription />} />
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
