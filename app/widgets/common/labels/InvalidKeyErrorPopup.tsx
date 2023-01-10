import type { FunctionComponent } from 'react';
import React from 'react';
import LabelErrorPopup from './LabelErrorPopup';

interface InvalidKeyErrorPopupProps {
    keyPrefix: string;
    reservedKeys: string[];
}

const InvalidKeyErrorPopup: FunctionComponent<InvalidKeyErrorPopupProps> = ({ keyPrefix, reservedKeys }) => {
    const { i18n } = Stage;

    return (
        <LabelErrorPopup
            content={i18n.t('widgets.common.labels.invalidKeyError', {
                keyPrefix,
                reservedKeys: reservedKeys.join(', ')
            })}
        />
    );
};
export default InvalidKeyErrorPopup;
