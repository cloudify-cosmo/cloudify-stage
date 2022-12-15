import type { FunctionComponent } from 'react';
import React from 'react';
import InputsHelpDescription from './InputsHelpDescription';
import { Button, Popup } from '../../../components/basic';

const InputsHelpIcon: FunctionComponent = () => {
    return (
        <Popup
            flowing
            trigger={<Button icon="help" floated="right" />}
            header="Value type"
            content={<InputsHelpDescription />}
        />
    );
};

export default InputsHelpIcon;
