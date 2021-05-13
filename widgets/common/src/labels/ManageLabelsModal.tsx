import { FunctionComponent } from 'react';
import LabelsModal, { LabelsModalProps } from './LabelsModal';

type ManageLabelsModalProps = Omit<LabelsModalProps, 'i18nHeaderKey' | 'i18nApplyKey'>;

const ManageLabelsModal: FunctionComponent<ManageLabelsModalProps> = props => {
    return (
        <LabelsModal
            i18nHeaderKey="widgets.common.labels.modalHeader"
            i18nApplyKey="widgets.common.labels.modalApplyButton"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
};
export default ManageLabelsModal;
