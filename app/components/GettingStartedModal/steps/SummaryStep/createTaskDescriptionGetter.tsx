import React from 'react';

import type { ReactNode } from 'react';

import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';
import { TaskStatus } from '../../installation/process';

const createTaskDescriptionGetter = (processingMessage: string, successMessage: string, errorMessage: string) => {
    return (taskName: string, taskStatuses?: Record<string, TaskStatus>, defaultDescription?: ReactNode) => {
        switch (taskStatuses?.[taskName]) {
            case TaskStatus.InstallationProgress:
                return <ProcessingDescription message={processingMessage} />;
            case TaskStatus.InstallationDone:
                return <SuccessDescription message={successMessage} />;
            case TaskStatus.InstallationError:
                return <ErrorDescription message={errorMessage} />;
            default:
                return defaultDescription;
        }
    };
};

export default createTaskDescriptionGetter;
