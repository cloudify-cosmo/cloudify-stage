import LabelsModal from './LabelsModal';

export default function ManageLabelsModal(props) {
    return (
        <LabelsModal
            i18nHeaderKey="widgets.common.labels.modalHeader"
            i18nApplyKey="widgets.common.labels.modalApplyButton"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}
