import type { FunctionComponent } from 'react';

const t = Stage.Utils.getT('widgets.common.deployments.executeModal');

function renderActionCheckbox(name: string, checked: boolean, onChange: (event: any, field: any) => void) {
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

function renderActionField(name: string, checked: boolean, onChange: (event: any, field: any) => void) {
    const { Field } = Stage.Basic.Form;
    return <Field>{renderActionCheckbox(name, checked, onChange)}</Field>;
}

interface Props {
    baseWorkflowParams: any; // TODO: change type
    userWorkflowParams: any; // TODO: change type
    errors: any; // TODO: change type
    handleYamlFileChange: (file: File) => void;
    fileLoading: boolean;
    handleExecuteInputChange: (event: any, field: any) => void; // TODO: change type `any`
    showInstallOptions: boolean;
    force: boolean;
    dryRun: boolean;
    queue: boolean;
    schedule: boolean;
    scheduledTime: string;
    createChangeEvent: (fieldName: string) => (event: any, field: any) => void;
}

const InstallSection: FunctionComponent<Props> = ({
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

                    {renderActionField('force', force, createChangeEvent('force'))}
                    {renderActionField('dryRun', dryRun, createChangeEvent('dryRun'))}
                    {renderActionField('queue', queue, createChangeEvent('queue'))}

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

export default InstallSection;
