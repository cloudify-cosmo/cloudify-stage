import type { FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import InputsHelpDescription from './InputsHelpDescription';
import { Popup } from '../../../components/basic';
import { icons } from './icons';

const InputsHelpIcon: FunctionComponent = () => {
    return (
        <Popup
            flowing
            trigger={<span className={icons.helpCir}></span>}
            header={i18n.t('widgets.common.inputs.buttons.help.header')}
            content={<InputsHelpDescription />}
        />
    );
};

export default InputsHelpIcon;
