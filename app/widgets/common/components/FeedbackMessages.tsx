import type { FunctionComponent } from 'react';
import React from 'react';
import { isEmpty, noop } from 'lodash';
import { ErrorMessage, Message } from '../../../components/basic';

export interface FeedbackMessagesProps {
    successMessages?: string[];
    onDismissSuccess?: (message: string) => void;
    errorMessages?: string[] | null;
    onDismissErrors?: () => void;
}

const FeedbackMessages: FunctionComponent<FeedbackMessagesProps> = ({
    successMessages = [],
    onDismissSuccess = noop,
    errorMessages = null,
    onDismissErrors = noop
}) => {
    return (
        <>
            {successMessages.map(message => (
                <Message key={message} success onDismiss={() => onDismissSuccess(message)}>
                    {message}
                </Message>
            ))}
            {!isEmpty(errorMessages) && <ErrorMessage error={errorMessages} onDismiss={onDismissErrors} />}
        </>
    );
};

export default FeedbackMessages;
