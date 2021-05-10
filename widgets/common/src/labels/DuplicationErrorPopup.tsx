import LabelErrorPopup from './LabelErrorPopup';

export default function DuplicationErrorPopup() {
    const { i18n } = Stage;

    return <LabelErrorPopup content={i18n.t('widgets.common.labels.labelDuplicationError')} />;
}
