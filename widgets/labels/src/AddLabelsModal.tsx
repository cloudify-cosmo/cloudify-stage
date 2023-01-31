import type { LabelsModalProps } from 'app/widgets/common/labels/LabelsModal';

type AddLabelsModalProps = Omit<LabelsModalProps, 'i18nHeaderKey' | 'i18nApplyKey'>;
export default function AddLabelsModal(props: AddLabelsModalProps) {
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
