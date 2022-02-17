import type { CommonExecuteWorflowProps } from './ExecuteWorkflowInputs';
import type { Workflow, Errors } from './types';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

export function getWorkflowName(workflow: Workflow | string) {
    return typeof workflow === 'string' ? workflow : workflow.name;
}

const isValidScheduledTime = (scheduledTime: string) => {
    const scheduledTimeMoment = moment(scheduledTime);
    const hasProperFormat = _.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), scheduledTime);
    return scheduledTimeMoment.isValid() && hasProperFormat && !scheduledTimeMoment.isBefore(moment());
};

const normalizeScheduledTime = (schedule: boolean, scheduledTime: string) =>
    schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;

interface ExecuteWorkflowParams extends CommonExecuteWorflowProps {
    deploymentsList: any[];
    setLoading: () => void;
    toolbox: Stage.Types.Toolbox;
    workflow: string | Workflow;
    unsetLoading: () => void;
    clearErrors: () => void;
    onExecute: (
        workflowParameters: Record<string, string>,
        workflowOptions: {
            force: boolean;
            dryRun: boolean;
            queue: boolean;
            scheduledTime: string;
        }
    ) => void;
    onHide: () => void;
}

export const executeWorkflow = ({
    deploymentsList,
    setLoading,
    toolbox,
    workflow,
    baseWorkflowInputs,
    userWorkflowInputsState,
    schedule,
    scheduledTime,
    force,
    dryRun,
    queue,
    unsetLoading,
    clearErrors,
    onExecute,
    onHide = () => {}
}: ExecuteWorkflowParams): Promise<void | boolean[] | Errors> => {
    const { InputsUtils, DeploymentActions } = Stage.Common;
    const validationErrors: Errors = {};

    const name = getWorkflowName(workflow);
    if (!name) {
        return Promise.reject(t('errors.missingWorkflow'));
    }

    const inputsWithoutValue = InputsUtils.getInputsWithoutValues(baseWorkflowInputs, userWorkflowInputsState);
    InputsUtils.addErrors(inputsWithoutValue, validationErrors);

    if (schedule && !isValidScheduledTime(scheduledTime)) {
        validationErrors.scheduledTime = t('errors.scheduleTimeError');
    }

    if (!_.isEmpty(validationErrors)) {
        return Promise.reject(validationErrors);
    }

    const workflowParameters = InputsUtils.getInputsMap(baseWorkflowInputs, userWorkflowInputsState);

    if (_.isFunction(onExecute) && onExecute !== _.noop) {
        onExecute(workflowParameters, {
            force,
            dryRun,
            queue,
            scheduledTime: normalizeScheduledTime(schedule, scheduledTime)
        });
        onHide();
        return Promise.resolve();
    }

    if (_.isEmpty(deploymentsList)) {
        return Promise.reject(t('errors.missingDeployment'));
    }

    setLoading();
    const actions = new DeploymentActions(toolbox);

    const executePromises = _.map(deploymentsList, (id: string) => {
        return actions
            .doExecute(id, name, workflowParameters, {
                force,
                dryRun,
                queue,
                scheduledTime: normalizeScheduledTime(schedule, scheduledTime)
            })
            .then(() => {
                unsetLoading();
                clearErrors();
                onHide();
                toolbox.getEventBus().trigger('executions:refresh');
                // NOTE: pass id to keep the current deployment selected
                toolbox.getEventBus().trigger('deployments:refresh', id);
            });
    });

    return Promise.all(executePromises);
};
