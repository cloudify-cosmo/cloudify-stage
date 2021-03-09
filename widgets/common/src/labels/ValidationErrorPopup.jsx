import LabelErrorPopup from './LabelErrorPopup';

export default function ValidationErrorPopup({ open }) {
    const { i18n } = Stage;

    return <LabelErrorPopup open={open} content={i18n.t('widgets.common.labels.validationError')} />;
}

ValidationErrorPopup.propTypes = {
    open: PropTypes.bool.isRequired
};
