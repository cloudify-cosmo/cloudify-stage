import type { FunctionComponent } from 'react';
import React from 'react';
import InputsHelpDescription from './InputsHelpDescription';
import { Icon, Popup } from '../../../components/basic';

const InputsHelpIcon: FunctionComponent = () => {
    return (
        <Popup
            flowing
            trigger={<Icon name="help" color="blue" size="large" link />}
            header="Value type" // TODO: Add translation support
            content={<InputsHelpDescription />}
        />
    );
};

export default InputsHelpIcon;
