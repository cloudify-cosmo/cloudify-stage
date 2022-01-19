export type Workflow =
    | string
    | {
          name: string;
      };

export type Errors =
    | string
    | {
          [key: string]: string;
      };

export function isWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string';
}

export function getWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string' ? workflow : workflow.name;
}

export const createInstallFunction = ({
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
    clearLoading,
    clearErrors,
    onDeployAndInstall
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
    clearLoading: () => void;
    clearErrors: () => void;
    onDeployAndInstall: () => void;
}) => () => {
    setLoading();

    const { InputsUtils, DeploymentActions } = Stage.Common;
    const validationErrors: { [key: string]: string } = {};
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

    if (_.isFunction(onDeployAndInstall) && onDeployAndInstall !== _.noop) {
        onDeployAndInstall(workflowParameters, {
            force,
            dryRun,
            queue,
            scheduledTime: schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined
        });
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
                clearLoading();
                clearErrors();
                toolbox.getEventBus().trigger('executions:refresh');
                // NOTE: pass id to keep the current deployment selected
                toolbox.getEventBus().trigger('deployments:refresh', id);
            });
    });

    return Promise.all(executePromises).catch(err => {
        clearLoading();
        setErrors(err.message);
    });
};
