import type { FunctionComponent } from 'react';
import type {
    OnDateInputChange,
    OnDropdownChange,
    OnCheckboxChange,
    BaseWorkflowInputs,
    UserWorkflowInputsState
} from './types';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

function renderActionCheckbox(name: string, checked: boolean, onChange: OnCheckboxChange) {
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

function renderCheckboxField(name: string, checked: boolean, onChange: OnCheckboxChange) {
    const { Field } = Stage.Basic.Form;
    return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
}

export interface CommonExecuteWorflowProps {
    baseWorkflowInputs: BaseWorkflowInputs;
    userWorkflowInputsState: UserWorkflowInputsState;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
}

interface ExecuteWorkflowInputsProps extends CommonExecuteWorflowProps {
    errors: Record<string, string>;
    onYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    onWorkflowInputChange: OnDropdownChange;
    showInstallOptions: boolean;
    onForceChange: OnCheckboxChange;
    onDryRunChange: OnCheckboxChange;
    onQueueChange: OnCheckboxChange;
    onScheduleChange: OnCheckboxChange;
    onScheduledTimeChange: OnDateInputChange;
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
    const { Message, Form, Header, Divider, DateInput } = Stage.Basic;
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

                    <Form.Field error={!!errors.scheduledTime}>
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
                    </Form.Field>
                </>
            )}
        </>
    );
};

export default React.memo(ExecuteWorkflowInputs);
