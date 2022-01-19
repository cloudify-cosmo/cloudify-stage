import type { FunctionComponent } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.execute');

type Field = {
    name: string;
    value: unknown;
    type: string;
    checked?: string;
};

type WorkflowParams = {
    [key: string]: {
        type?: string;
        default?: string;
        constraints?: {
            pattern: string;
        }[];
    };
};

function renderActionCheckbox(name: string, checked: boolean, onChange: (event: Event, field: Field) => void) {
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

function renderCheckboxField(name: string, checked: boolean, onChange: (event: Event, field: Field) => void) {
    const { Field } = Stage.Basic.Form;
    return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
}

interface Props {
    baseWorkflowParams: WorkflowParams;
    userWorkflowParams: WorkflowParams;
    errors: {
        errors?: string;
        scheduledTime?: string;
        yamlFile?: string;
        [inputName: string]: undefined | string;
    };
    handleYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    handleExecuteInputChange: (event: Event, field: Field) => void;
    showInstallOptions: boolean;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    createChangeEvent: (fieldName: string) => (event: Event, field: Field) => void;
}

const GenericInstall: FunctionComponent<Props> = ({
    baseWorkflowParams,
    userWorkflowParams,
    handleYamlFileChange,
    fileLoading,
    handleExecuteInputChange,
    errors,
    showInstallOptions,
    force,
    dryRun,
    queue,
    schedule,
    scheduledTime,
    createChangeEvent
}) => {
    const { Message, Form, UnsafelyTypedFormField, Header, Divider, DateInput } = Stage.Basic;
    const { YamlFileButton, InputsHeader, InputsUtils } = Stage.Common;
    return (
        <>
            {!_.isEmpty(baseWorkflowParams) && (
                <YamlFileButton
                    onChange={handleYamlFileChange}
                    dataType="execution parameters"
                    fileLoading={fileLoading}
                />
            )}
            <InputsHeader header={t('paramsHeader')} compact />
            {_.isEmpty(baseWorkflowParams) && <Message content={t('noParams')} />}

            {InputsUtils.getInputFields(baseWorkflowParams, handleExecuteInputChange, userWorkflowParams, errors)}
            {showInstallOptions && (
                <>
                    <Form.Divider className="">
                        <Header size="tiny">{t('actionsHeader')}</Header>
                    </Form.Divider>

                    {renderCheckboxField('force', force, createChangeEvent('force'))}
                    {renderCheckboxField('dryRun', dryRun, createChangeEvent('dryRun'))}
                    {renderCheckboxField('queue', queue, createChangeEvent('queue'))}

                    <UnsafelyTypedFormField error={!!errors.scheduledTime}>
                        {renderActionCheckbox('schedule', schedule, createChangeEvent('schedule'))}
                        {schedule && (
                            <>
                                <Divider hidden />
                                <DateInput
                                    name="scheduledTime"
                                    value={scheduledTime}
                                    defaultValue=""
                                    minDate={moment()}
                                    maxDate={moment().add(1, 'year')}
                                    onChange={createChangeEvent('scheduledTime')}
                                />
                            </>
                        )}
                    </UnsafelyTypedFormField>
                </>
            )}
        </>
    );
};

export default GenericInstall;
