import type { FunctionComponent } from 'react';
import React from 'react';
import LabelErrorPopup from './LabelErrorPopup';
import type { LabelInputType } from './types';

export interface ValidationErrorPopupProps {
    type: LabelInputType;
}

const ValidationErrorPopup: FunctionComponent<ValidationErrorPopupProps> = ({ type }) => {
    const { i18n } = Stage;

    return <LabelErrorPopup content={i18n.t(`widgets.common.labels.${type}ValidationError`)} />;
};
export default ValidationErrorPopup;
