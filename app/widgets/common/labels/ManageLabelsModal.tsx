import type { FunctionComponent } from 'react';
import React from 'react';
import type { LabelsModalProps } from './LabelsModal';
import LabelsModal from './LabelsModal';

type ManageLabelsModalProps = Omit<LabelsModalProps, 'i18nHeaderKey' | 'i18nApplyKey'>;

const ManageLabelsModal: FunctionComponent<ManageLabelsModalProps> = props => {
    return (
        <LabelsModal
            i18nHeaderKey="widgets.common.labels.modalHeader"
            i18nApplyKey="widgets.common.labels.modalApplyButton"
            {...props}
        />
    );
};
export default ManageLabelsModal;
