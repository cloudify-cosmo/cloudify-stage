import React from 'react';
import { ErrorMessage } from '../basic';
import ErrorMessageWithPopup from './ErrorMessageWithPopup';

interface WidgetErrorMessageProps {
    widgetName: string;
    header: string;
    content: string;
    showErrorWithPopup: boolean;
}

const WidgetErrorMessage = ({ header, content, widgetName, showErrorWithPopup }: WidgetErrorMessageProps) => {
    return showErrorWithPopup ? (
        <ErrorMessageWithPopup widgetName={widgetName} header={header} content={content} />
    ) : (
        <ErrorMessage header={header} error={content} autoHide />
    );
};

export default WidgetErrorMessage;
