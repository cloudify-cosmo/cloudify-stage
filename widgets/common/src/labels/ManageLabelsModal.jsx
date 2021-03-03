import LabelsModal from './LabelsModal';

export default function ManageLabelsModal(props) {
    return (
        <LabelsModal
            headerKey="widgets.common.labels.modalHeader"
            applyKey="widgets.common.labels.modalApplyButton"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}
