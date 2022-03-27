import type { FunctionComponent } from 'react';
import InputsHelpDescription from './InputsHelpDescription';

const InputsHelpIcon: FunctionComponent = () => {
    const { Button, Popup } = Stage.Basic;
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
