import React from 'react';
import type { ReactNode } from 'react';

import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';
import { TaskStatus } from '../../installation/process';
import type { SecretInstallationTask } from '../../installation/tasks';

export const createTaskDescriptionGetter = (
    processingMessage: string,
    successMessage: string,
    errorMessage: string
) => {
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

export const createSecretTaskDescriptionGetter = (
    processingMessage: string,
    successMessage: string,
    errorMessage: string,
    skipMessage: string
) => {
    return (
        task: SecretInstallationTask,
        taskStatuses?: Record<string, TaskStatus>,
        defaultDescription?: ReactNode
    ) => {
        if (!task.value) {
            return skipMessage;
        }

        return createTaskDescriptionGetter(processingMessage, successMessage, errorMessage)(
            task.name,
            taskStatuses,
            defaultDescription
        );
    };
};

export default createTaskDescriptionGetter;
