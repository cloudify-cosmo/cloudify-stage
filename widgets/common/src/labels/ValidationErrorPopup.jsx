import LabelErrorPopup from './LabelErrorPopup';

export default function ValidationErrorPopup() {
    const { i18n } = Stage;

    return <LabelErrorPopup open content={i18n.t('widgets.common.labels.validationError')} />;
}
