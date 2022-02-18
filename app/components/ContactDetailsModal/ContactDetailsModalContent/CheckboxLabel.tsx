import React, { FunctionComponent, memo } from 'react';
import StageUtils from '../../../utils/stageUtils';

const t = StageUtils.getT('contactDetailsModal.form');

interface CheckboxLabelProps {
    label: string;
}

const CheckboxLabel: FunctionComponent<CheckboxLabelProps> = ({ label }) => {
    return (
        <span
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
                __html: t(label)
            }}
        />
    );
};

export default memo(CheckboxLabel);
