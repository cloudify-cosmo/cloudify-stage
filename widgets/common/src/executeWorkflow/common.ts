import type { CommonExecuteWorflowProps } from './ExecuteWorkflowInputs';
import type { Workflow } from './types';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

export type Errors = string | Record<string, string>;

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
    workflow: Workflow;
    setErrors: (errors: Errors) => void;
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
    setErrors,
    unsetLoading,
    clearErrors,
    onExecute,
    onHide = () => {}
}: ExecuteWorkflowParams) => {
    const { InputsUtils, DeploymentActions } = Stage.Common;
    const validationErrors: Errors = {};

    const name = getWorkflowName(workflow);
    if (!name) {
        setErrors(t('errors.missingWorkflow'));
        return false;
    }

    const inputsWithoutValue = InputsUtils.getInputsWithoutValues(baseWorkflowInputs, userWorkflowInputsState);
    InputsUtils.addErrors(inputsWithoutValue, validationErrors);

    if (schedule && !isValidScheduledTime(scheduledTime)) {
        validationErrors.scheduledTime = t('errors.scheduleTimeError');
    }

    if (!_.isEmpty(validationErrors)) {
        setErrors(validationErrors);
        return false;
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
        return true;
    }

    if (_.isEmpty(deploymentsList)) {
        setErrors(t('errors.missingDeployment'));
        return false;
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

    return Promise.all(executePromises).catch(err => {
        unsetLoading();
        setErrors(err.message);
    });
};
