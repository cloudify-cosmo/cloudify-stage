import { isEmpty, noop } from 'lodash';

import type { FunctionComponent } from 'react';

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
    const { ErrorMessage, Message } = Stage.Basic;

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
