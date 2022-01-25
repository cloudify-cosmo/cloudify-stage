const t = Stage.Utils.getT('widgets.common.deployments.execute');

export type BaseWorkflowInputs = Record<
    string,
    {
        type?: string;
        default?: string;
        constraints?: {
            pattern: string;
        }[];
    }
>;

export type UserWorkflowInputsState = Record<string, string | number | boolean | null | undefined>;

export type Workflow =
    | string
    | {
          name: string;
          id?: string;
          plan?: {
              inputs?: Record<string, string>;
              workflows?: { install?: Record<string, string> };
          };
      };

export type Errors = string | Record<string, string>;

export function isWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string';
}

export function getWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string' ? workflow : workflow.name;
}

const isValidScheduledTime = (time: string) => {
    const scheduledTime = moment(time);
    const hasProperFormat = _.isEqual(scheduledTime.format('YYYY-MM-DD HH:mm'), time);
    return scheduledTime.isValid() || hasProperFormat || scheduledTime.isBefore(moment());
};

const normalizeScheduledTime = (schedule: boolean, scheduledTime: string) =>
    schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;

export const executeWorkflow = ({
    deployments,
    setLoading,
    toolbox,
    workflow,
    baseWorkflowParams,
    userWorkflowParams,
    schedule,
    scheduledTime,
    force,
    dryRun,
    queue,
    deploymentId,
    setErrors,
    unsetLoading,
    clearErrors,
    onExecute,
    onHide = () => {}
}: {
    deployments: any[];
    setLoading: () => void;
    toolbox: Stage.Types.Toolbox;
    workflow: Workflow;
    baseWorkflowParams: BaseWorkflowInputs;
    userWorkflowParams: UserWorkflowInputsState;
    schedule: boolean;
    scheduledTime: string;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    deploymentId: string;
    setErrors: (errors: Errors) => void;
    unsetLoading: () => void;
    clearErrors: () => void;
    onExecute: () => void;
    onHide: () => void;
}) => {
    setLoading();

    const { InputsUtils, DeploymentActions } = Stage.Common;
    const validationErrors: Record<string, string> = {};
    const deploymentsList: string[] = _.isEmpty(deployments) ? _.compact([deploymentId]) : deployments;

    const name = getWorkflowName(workflow);

    if (!name) {
        setErrors(t('errors.missingWorkflow'));
        return false;
    }

    const inputsWithoutValue = InputsUtils.getInputsWithoutValues(baseWorkflowParams, userWorkflowParams);
    InputsUtils.addErrors(inputsWithoutValue, validationErrors);

    if (schedule && !isValidScheduledTime(scheduledTime)) {
        validationErrors.scheduledTime = t('errors.scheduleTimeError');
    }

    if (!_.isEmpty(validationErrors)) {
        setErrors(validationErrors);
        return false;
    }

    const workflowParameters = InputsUtils.getInputsMap(baseWorkflowParams, userWorkflowParams);

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

    const actions = new DeploymentActions(toolbox);

    const executePromises = _.map(deploymentsList, id => {
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
