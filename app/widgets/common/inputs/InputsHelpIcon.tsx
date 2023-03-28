import type { FunctionComponent } from 'react';
import React from 'react';
import i18n from 'i18next';
import InputsHelpDescription from './InputsHelpDescription';
import { Popup } from '../../../components/basic';

const InputsHelpIcon: FunctionComponent = () => {
    return (
        <Popup
            flowing
            trigger={<span className="dds__icon dds__icon--help-cir icon-button"></span>}
            header={i18n.t('widgets.common.inputs.buttons.help.header')}
            content={<InputsHelpDescription />}
        />
    );
};

export default InputsHelpIcon;
