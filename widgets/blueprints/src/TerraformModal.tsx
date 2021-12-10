import React, { useState } from 'react';
import type { DropdownProps } from 'semantic-ui-react';
import TerraformModalAccordion from './TerraformModalAccordion';
import TerraformModalTableAccordion from './TerraformModalTableAccordion';
import TerraformVariableValueInput from './TerraformVariableValueInput';
import TerraformActions from './TerraformActions';
import terraformVersions from './terraformVersions';
import type { CustomConfigurationComponentProps } from '../../../app/utils/StageAPI';
import type { Variable, Output } from '../../../backend/routes/Terraform.types';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');

const { Dropdown } = Stage.Basic;

const terraformVersionOptions = terraformVersions.map(versionOption => ({
    text: versionOption,
    value: versionOption
}));
terraformVersionOptions[0].text = `${terraformVersionOptions[0].text} (${t('default')})`;

function getDynamicTableDropdown(options: DropdownProps['options']) {
    return ({ name, onChange, ...rest }: CustomConfigurationComponentProps<string>) => {
        return (
            <Dropdown
                clearable={false}
                selection
                options={options}
                onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...rest}
            />
        );
    };
}

const dynamicTableFieldStyle = { height: 38 };

const variablesColumns = [
    {
        id: 'variable',
        label: t('variablesTable.variable'),
        type: Stage.Basic.GenericField.STRING_TYPE
    },
    {
        id: 'source',
        label: t('variablesTable.source'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: getDynamicTableDropdown([
            { text: t('variablesTable.sources.secret'), value: 'secret' },
            { text: t('variablesTable.sources.input'), value: 'input' },
            { text: t('variablesTable.sources.static'), value: 'static' }
        ]),
        style: dynamicTableFieldStyle
    },
    {
        id: 'value',
        label: t('variablesTable.value'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: TerraformVariableValueInput,
        style: dynamicTableFieldStyle
    }
];

const outputsColumns = [
    {
        id: 'output',
        label: t('outputsTable.output'),
        default: '',
        type: Stage.Basic.GenericField.STRING_TYPE
    },
    {
        id: 'type',
        label: t('outputsTable.type'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: getDynamicTableDropdown([
            { text: t('outputsTable.types.output'), value: 'output' },
            { text: t('outputsTable.types.capability'), value: 'capability' }
        ]),
        style: dynamicTableFieldStyle
    },
    {
        id: 'terraformOutput',
        label: t('outputsTable.terraformOutput'),
        default: '',
        type: Stage.Basic.GenericField.STRING_TYPE
    }
];

export default function TerraformModal({
    onHide,
    toolbox
}: {
    onHide: () => void;
    toolbox: Stage.Types.WidgetlessToolbox;
}) {
    const { useBoolean, useInput, useResettableState } = Stage.Hooks;

    const [processPhase, setProcessPhase, stopProcess] = useResettableState<'generation' | 'upload' | null>(null);
    const [cancelConfirmVisible, showCancelConfirm, hideCancelConfirm] = useBoolean();

    const [version, setVersion] = useInput(terraformVersions[0]);
    const [blueprintName, setBlueprintName] = useInput('');
    const [templateUrl, setTemplateUrl] = useInput('');
    const [resourceLocation, setResourceLocation] = useInput('');
    const [variables, setVariables] = useState<Variable[]>([]);
    const [environment, setEnvironment] = useState<Variable[]>([]);
    const [outputs, setOutputs] = useState<Output[]>([]);

    function handleSubmit() {
        const { BlueprintActions } = Stage.Common;
        setProcessPhase('generation');
        new TerraformActions(toolbox)
            .doGenerateBlueprint({
                terraformTemplate: templateUrl,
                terraformVersion: version,
                resourceLocation,
                variables,
                environmentVariables: environment,
                outputs
            })
            .then(blueprintContent => {
                setProcessPhase('upload');
                const file: any = new Blob([blueprintContent]);
                file.name = 'blueprint.yaml';
                return new BlueprintActions(toolbox).doUpload(
                    blueprintName,
                    '',
                    '',
                    file,
                    '',
                    null,
                    Stage.Common.Consts.defaultVisibility
                );
            })
            .then(() => {
                toolbox.getEventBus().trigger('blueprints:refresh');
                onHide();
            })
            .catch(stopProcess);
    }

    const {
        Accordion,
        ApproveButton,
        CancelButton,
        Confirm,
        Divider,
        Header,
        LoadingOverlay,
        Modal,
        Form,
        UnsafelyTypedFormField
    } = Stage.Basic;

    return (
        <Modal open onClose={onHide}>
            {processPhase && <LoadingOverlay message={t(`progress.${processPhase}`)} />}

            <Modal.Header>{t('header')}</Modal.Header>

            <Modal.Content>
                <Form>
                    <UnsafelyTypedFormField label={t(`blueprintName`)} required>
                        <Form.Input value={blueprintName} onChange={setBlueprintName} />
                    </UnsafelyTypedFormField>
                    <UnsafelyTypedFormField label={t(`terraformVersion`)} required>
                        <Form.Dropdown
                            search
                            selection
                            options={terraformVersionOptions}
                            value={version}
                            onChange={setVersion}
                            clearable={false}
                        />
                    </UnsafelyTypedFormField>
                    <Accordion>
                        <TerraformModalAccordion title={t('blueprintInformation')} initialActive>
                            <Divider style={{ margin: '0 -14px 14px' }} />
                            <UnsafelyTypedFormField label={t(`template`)} required>
                                <Form.Input value={templateUrl} onChange={setTemplateUrl} />
                            </UnsafelyTypedFormField>
                            <UnsafelyTypedFormField label={t(`resourceLocation`)} required>
                                <Form.Input value={resourceLocation} onChange={setResourceLocation} />
                            </UnsafelyTypedFormField>
                        </TerraformModalAccordion>
                        <Header size="tiny">{t('mapping')}</Header>
                        <TerraformModalTableAccordion
                            title={t('variables')}
                            value={variables}
                            onChange={setVariables}
                            columns={variablesColumns}
                            toolbox={toolbox}
                        />
                        <TerraformModalTableAccordion
                            title={t('environment')}
                            value={environment}
                            onChange={setEnvironment}
                            columns={variablesColumns}
                            toolbox={toolbox}
                        />
                        <TerraformModalTableAccordion
                            title={t('outputs')}
                            value={outputs}
                            onChange={setOutputs}
                            columns={outputsColumns}
                            toolbox={toolbox}
                        />
                    </Accordion>
                </Form>
            </Modal.Content>

            <Modal.Actions>
                <CancelButton onClick={showCancelConfirm} />
                <ApproveButton content={t('submit')} onClick={handleSubmit} />
            </Modal.Actions>

            <Confirm
                open={cancelConfirmVisible}
                content={t('cancelConfirm')}
                onConfirm={onHide}
                onCancel={hideCancelConfirm}
            />
        </Modal>
    );
}
