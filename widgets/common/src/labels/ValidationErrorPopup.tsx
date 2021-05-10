import type { FunctionComponent } from 'react';
import LabelErrorPopup from './LabelErrorPopup';

const ValidationErrorPopup: FunctionComponent = () => {
    const { i18n } = Stage;

    return <LabelErrorPopup content={i18n.t('widgets.common.labels.validationError')} />;
};
export default ValidationErrorPopup;
