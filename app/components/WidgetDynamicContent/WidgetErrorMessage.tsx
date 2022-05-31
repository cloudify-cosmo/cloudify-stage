import React from 'react';
import { ErrorMessage } from '../basic';
import ErrorMessageWithPopup from './ErrorMessageWithPopup';

interface WidgetErrorMessageProps {
    widgetName: string;
    header: string;
    content: string;
    showErrorInPopup: boolean;
}

const WidgetErrorMessage = ({ header, content, widgetName, showErrorInPopup }: WidgetErrorMessageProps) => {
    return showErrorInPopup ? (
        <ErrorMessageWithPopup widgetName={widgetName} header={header} content={content} />
    ) : (
        <ErrorMessage header={header} error={content} autoHide />
    );
};

export default WidgetErrorMessage;
