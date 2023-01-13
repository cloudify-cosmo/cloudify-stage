import React from 'react';
import type { ErrorMessageProps } from 'cloudify-ui-components/typings/components/elements/ErrorMessage/ErrorMessage';
import { ErrorMessage } from '../../../../basic';
import ErrorMessageWithPopup from './ErrorMessageWithPopup';

interface WidgetErrorMessageProps {
    widgetName: string;
    header: string;
    content: ErrorMessageProps['error'];
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
