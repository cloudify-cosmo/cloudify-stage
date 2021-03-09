import LabelErrorPopup from './LabelErrorPopup';

export default function DuplicationErrorPopup({ open }) {
    const { i18n } = Stage;

    return <LabelErrorPopup open={open} content={i18n.t('widgets.common.labels.labelDuplicationError')} />;
}

DuplicationErrorPopup.propTypes = {
    open: PropTypes.bool.isRequired
};
