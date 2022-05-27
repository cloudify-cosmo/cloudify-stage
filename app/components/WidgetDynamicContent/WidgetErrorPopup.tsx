import React from 'react';
import { ErrorPopup } from '../shared';
import type { ErrorPopupProps } from '../shared/ErrorPopup';
import { useBoolean } from '../../utils/hooks';

interface WidgetErrorPopupProps {
    trigger: ErrorPopupProps['trigger'];
    header: ErrorPopupProps['header'];
    content: ErrorPopupProps['content'];
}

const WidgetErrorPopup = ({ header, content, trigger }: WidgetErrorPopupProps) => {
    const [isPopupVisible, _, hidePopup] = useBoolean(true);

    return (
        <ErrorPopup open={isPopupVisible} header={header} content={content} trigger={trigger} onDismiss={hidePopup} />
    );
};

export default WidgetErrorPopup;
