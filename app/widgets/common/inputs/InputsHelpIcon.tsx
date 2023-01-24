import type { FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import InputsHelpDescription from './InputsHelpDescription';
import { Icon, Popup } from '../../../components/basic';

const InputsHelpIcon: FunctionComponent = () => {
    return (
        <Popup
            flowing
            trigger={<Icon name="help" color="blue" size="large" link />}
            header={i18n.t('widgets.common.inputs.buttons.help.header')}
            content={<InputsHelpDescription />}
        />
    );
};

export default InputsHelpIcon;
