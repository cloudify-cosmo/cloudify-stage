import type { FunctionComponent } from 'react';
import React from 'react';
import LabelErrorPopup from './LabelErrorPopup';

const DuplicationErrorPopup: FunctionComponent = () => {
    const { i18n } = Stage;

    return <LabelErrorPopup content={i18n.t('widgets.common.labels.labelDuplicationError')} />;
};

export default DuplicationErrorPopup;
