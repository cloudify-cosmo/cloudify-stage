import type { LabelsModalProps } from 'app/widgets/common/labels/LabelsModal';

export default function AddLabelsModal(props: Omit<LabelsModalProps, 'i18nHeaderKey' | 'i18nApplyKey'>) {
    const { Modal } = Stage.Common.Labels;
    return (
        <Modal
            hideInitialLabels
            i18nHeaderKey="widgets.labels.addHeader"
            i18nApplyKey="widgets.labels.add"
            {...props}
        />
    );
}
