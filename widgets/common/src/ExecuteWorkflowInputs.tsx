import type { FunctionComponent } from 'react';
import type { BaseWorkflowInputs, UserWorkflowInputsState, OnChange } from './executeWorkflow';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

function renderActionCheckbox(name: string, checked: boolean, onChange: OnChange) {
    const { Checkbox } = Stage.Basic.Form;
    return (
        <Checkbox
            name={name}
            toggle
            label={t(`actions.${name}.label`)}
            help={t(`actions.${name}.help`)}
            checked={checked}
            onChange={onChange}
        />
    );
}

function renderCheckboxField(name: string, checked: boolean, onChange: OnChange) {
    const { Field } = Stage.Basic.Form;
    return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
}

interface ExecuteWorkflowInputsProps {
    baseWorkflowInputs: BaseWorkflowInputs;
    userWorkflowInputsState: UserWorkflowInputsState;
    errors: Record<string, string>;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onWorkflowInputChange: OnChange;
    showInstallOptions: boolean;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    onForceChange: OnChange;
    onDryRunChange: OnChange;
    onQueueChange: OnChange;
    onScheduleChange: OnChange;
    onScheduledTimeChange: OnChange;
}

const ExecuteWorkflowInputs: FunctionComponent<ExecuteWorkflowInputsProps> = ({
    baseWorkflowInputs,
    userWorkflowInputsState,
    onYamlFileChange,
    fileLoading,
    onWorkflowInputChange,
    errors,
    showInstallOptions,
    force,
    dryRun,
    queue,
    schedule,
    scheduledTime,
    onForceChange,
    onDryRunChange,
    onQueueChange,
    onScheduleChange,
    onScheduledTimeChange
}) => {
    const { Message, Form, UnsafelyTypedFormField, Header, Divider, DateInput } = Stage.Basic;
    const { YamlFileButton, InputsHeader, InputsUtils } = Stage.Common;
    return (
        <>
            {!_.isEmpty(baseWorkflowInputs) && (
                <YamlFileButton onChange={onYamlFileChange} dataType="execution parameters" fileLoading={fileLoading} />
            )}
            <InputsHeader header={t('paramsHeader')} compact />
            {_.isEmpty(baseWorkflowInputs) && <Message content={t('noParams')} />}

            {InputsUtils.getInputFields(baseWorkflowInputs, onWorkflowInputChange, userWorkflowInputsState, errors)}
            {showInstallOptions && (
                <>
                    <Form.Divider className="">
                        <Header size="tiny">{t('actionsHeader')}</Header>
                    </Form.Divider>

                    {renderCheckboxField('force', force, onForceChange)}
                    {renderCheckboxField('dryRun', dryRun, onDryRunChange)}
                    {renderCheckboxField('queue', queue, onQueueChange)}

                    <UnsafelyTypedFormField error={!!errors.scheduledTime}>
                        {renderActionCheckbox('schedule', schedule, onScheduleChange)}
                        {schedule && (
                            <>
                                <Divider hidden />
                                <DateInput
                                    name="scheduledTime"
                                    value={scheduledTime}
                                    defaultValue=""
                                    minDate={moment()}
                                    maxDate={moment().add(1, 'year')}
                                    onChange={onScheduledTimeChange}
                                />
                            </>
                        )}
                    </UnsafelyTypedFormField>
                </>
            )}
        </>
    );
};

export default React.memo(ExecuteWorkflowInputs);
