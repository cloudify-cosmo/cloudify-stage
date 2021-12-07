import React from 'react';

import type { ReactNode } from 'react';

import { ErrorDescription, ProcessingDescription, SuccessDescription } from './descriptions';
import { TaskStatus } from '../../installation/process';
import { SecretInstallationTask } from '../../installation/tasks';

const createTaskDescriptionGetter = (
    skipMessage: string,
    processingMessage: string,
    successMessage: string,
    errorMessage: string
) => {
    return (
        task: SecretInstallationTask,
        taskStatuses?: Record<string, TaskStatus>,
        defaultDescription?: ReactNode
    ) => {
        if (!task.value) {
            return skipMessage;
        }

        switch (taskStatuses?.[task.name]) {
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
