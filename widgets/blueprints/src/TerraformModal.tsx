import React, { useState } from 'react';
import type { DropdownProps } from 'semantic-ui-react';
import TerraformModalAccordion from './TerraformModalAccordion';
import TerraformModalTableAccordion from './TerraformModalTableAccordion';
import TerraformVariableValueInput from './TerraformVariableValueInput';
import TerraformActions from './TerraformActions';
import type { CustomConfigurationComponentProps } from '../../../app/utils/StageAPI';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');

const terraformVersions = [
    '1.0.11',
    '1.0.10',
    '1.0.9',
    '1.0.8',
    '1.0.7',
    '1.0.6',
    '1.0.5',
    '1.0.4',
    '1.0.3',
    '1.0.2',
    '1.0.1',
    '1.0.0',
    '0.14.11',
    '0.14.10',
    '0.14.9',
    '0.14.8',
    '0.14.7',
    '0.14.6',
    '0.14.5',
    '0.14.4',
    '0.14.3',
    '0.14.2',
    '0.14.1',
    '0.14.0',
    '0.13.7',
    '0.13.6',
    '0.13.5',
    '0.13.4',
    '0.13.3',
    '0.13.2',
    '0.13.1',
    '0.13.0'
];

const { Dropdown } = Stage.Basic;

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
        style: { height: 38 }
    },
    {
        id: 'value',
        label: t('variablesTable.value'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: TerraformVariableValueInput,
        style: { height: 38 }
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
        style: { height: 38 }
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
    const [module, setModule] = useInput('');
    const [variables, setVariables] = useState<any[]>([]);
    const [environment, setEnvironment] = useState<any[]>([]);
    const [outputs, setOutputs] = useState<any[]>([]);

    function handleSubmit() {
        const { BlueprintActions } = Stage.Common;
        setProcessPhase('generation');
        new TerraformActions(toolbox)
            .doGenerateBlueprint({
                terraformTemplate: templateUrl,
                terraformVersion: version,
                resourceLocation: module,
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
                            options={terraformVersions.map(versionOption => ({
                                text: versionOption,
                                value: versionOption
                            }))}
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
                            <UnsafelyTypedFormField label={t(`module`)} required>
                                <Form.Input value={module} onChange={setModule} />
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
