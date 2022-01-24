type MapStrings = {
    [key: string]: string;
};

export type Workflow =
    | string
    | {
          name: string;
          id?: string;
          plan?: {
              inputs?: MapStrings;
              workflows?: { install?: MapStrings };
          };
      };

export type Errors = string | MapStrings;

export function isWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string';
}

export function getWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string' ? workflow : workflow.name;
}

export const createExecuteWorkflowFunction = ({
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
    setLoading: () => void;
    toolbox: any;
    workflow: Workflow;
    baseWorkflowParams: any;
    userWorkflowParams: any;
    schedule: any;
    scheduledTime: any;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    deploymentId: string;
    setErrors: (errors: Errors) => void;
    unsetLoading: () => void;
    clearErrors: () => void;
    onExecute: () => void;
    onHide: () => void;
}) => () => {
    setLoading();

    const { InputsUtils, DeploymentActions } = Stage.Common;
    const validationErrors: MapStrings = {};
    const deployments: any[] = [];
    const deploymentsList: string[] = _.isEmpty(deployments) ? _.compact([deploymentId]) : deployments;

    const name = getWorkflowName(workflow);

    const t = Stage.Utils.getT('widgets.common.deployments.execute');

    if (!name) {
        setErrors(t('errors.missingWorkflow'));
        return false;
    }

    const inputsWithoutValue = InputsUtils.getInputsWithoutValues(baseWorkflowParams, userWorkflowParams);
    InputsUtils.addErrors(inputsWithoutValue, validationErrors);

    if (schedule) {
        const scheduledTimeMoment = moment(scheduledTime);
        if (
            !scheduledTimeMoment.isValid() ||
            !_.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), scheduledTime) ||
            scheduledTimeMoment.isBefore(moment())
        ) {
            validationErrors.scheduledTime = t('errors.scheduleTimeError');
        }
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
            scheduledTime: schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined
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

    const executePromises = _.map(deploymentsList, id => {
        return actions
            .doExecute(id, name, workflowParameters, {
                force,
                dryRun,
                queue,
                scheduledTime: schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined
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
