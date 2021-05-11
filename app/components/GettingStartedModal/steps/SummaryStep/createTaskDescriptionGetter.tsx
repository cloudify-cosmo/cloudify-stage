import React from 'react';

import type { ReactNode } from 'react';
import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';

const createTaskDescriptionGetter = (processingMessage: string, successMessage: string, errorMessage: string) => {
    return (taskName: string, taskStatuses?: Record<string, string>, defaultDescription?: ReactNode) => {
        switch (taskStatuses?.[taskName]) {
            case 'installation-progress':
                return <ProcessingDescription message={processingMessage} />;
            case 'installation-done':
                return <SuccessDescription message={successMessage} />;
            case 'installation-error':
                return <ErrorDescription message={errorMessage} />;
            default:
                return defaultDescription;
        }
    };
};

export default createTaskDescriptionGetter;
