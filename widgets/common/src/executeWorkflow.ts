import type { ComponentProps } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

export type Field = {
    name: string;
    value: unknown;
    type: string;
    checked?: string;
};

export type OnDropDownChange = ComponentProps<typeof Stage.Basic.Dropdown>['onChange'];
export type OnCheckboxChange = ComponentProps<typeof Stage.Basic.Checkbox>['onChange'];

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

export type UserWorkflowInputsState = Record<
    string,
    string | number | boolean | string[] | Record<string, string> | null | undefined
>;

export type Workflow =
    | string
    | {
          name: string;
          plugin: string;
          operation?: string;
          // eslint-disable-next-line camelcase
          is_cascading?: boolean;
          parameters?: Record<string, string>;
      };

export type Errors = string | Record<string, string>;

export function isWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string';
}

export function getWorkflowName(workflow: Workflow) {
    return typeof workflow === 'string' ? workflow : workflow.name;
}

const isValidScheduledTime = (scheduledTime: string) => {
    const scheduledTimeMoment = moment(scheduledTime);
    const hasProperFormat = _.isEqual(scheduledTimeMoment.format('YYYY-MM-DD HH:mm'), scheduledTime);
    return scheduledTimeMoment.isValid() && hasProperFormat && !scheduledTimeMoment.isBefore(moment());
};

const normalizeScheduledTime = (schedule: boolean, scheduledTime: string) =>
    schedule ? moment(scheduledTime).format('YYYYMMDDHHmmZ') : undefined;

export const executeWorkflow = ({
    deploymentsList,
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
    setErrors,
    unsetLoading,
    clearErrors,
    onExecute,
    onHide = () => {}
}: {
    deploymentsList: any[];
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
    setErrors: (errors: Errors) => void;
    unsetLoading: () => void;
    clearErrors: () => void;
    onExecute: (
        installWorkflowParameters: Record<string, string>,
        installWorkflowOptions: {
            force: boolean;
            dryRun: boolean;
            queue: boolean;
            scheduledTime: string;
        }
    ) => void;
    onHide: () => void;
}) => {
    const { InputsUtils, DeploymentActions } = Stage.Common;
    const validationErrors: Record<string, string> = {};

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
