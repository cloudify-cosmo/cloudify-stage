import { isEmpty, noop } from 'lodash';

import type { FunctionComponent } from 'react';

interface FeedbackProps {
    successMessages?: string[];
    onDismissSuccess?: (message: string) => void;
    errorMessages?: string[] | null;
    onDismissErrors?: () => void;
}

const Feedback: FunctionComponent<FeedbackProps> = ({
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

export default Feedback;
declare global {
    namespace Stage.Common {
        export { Feedback };
    }
}

Stage.defineCommon({
    name: 'Feedback',
    common: Feedback
});
