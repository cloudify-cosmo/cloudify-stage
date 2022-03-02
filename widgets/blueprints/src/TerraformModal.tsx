import React, { useState } from 'react';
import type { CheckboxProps, DropdownProps } from 'semantic-ui-react';
import _, { find, isEmpty } from 'lodash';
import TerraformModalTableAccordion, { TerraformModalTableAccordionProps } from './TerraformModalTableAccordion';
import TerraformVariableValueInput from './TerraformVariableValueInput';
import TerraformActions from './TerraformActions';
import terraformVersions, { defaultVersion } from './terraformVersions';
import type { CustomConfigurationComponentProps } from '../../../app/utils/StageAPI';
import type { Variable, Output } from '../../../backend/routes/Terraform.types';
import terraformLogo from '../images/terraform-icon.png';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');
const tError = Stage.Utils.composeT(t, 'errors');

const { Dropdown, Input } = Stage.Basic;

const terraformVersionOptions = terraformVersions.map(versionOption => ({
    text: versionOption === defaultVersion ? `${versionOption} (${t('default')})` : versionOption,
    value: versionOption
}));

export const inputMaxLength = 256;

function LengthLimitedDynamicTableInput({ name, onChange, ...rest }: CustomConfigurationComponentProps<string>) {
    return (
        <Input
            name={name}
            onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
            {...rest}
        >
            <input maxLength={inputMaxLength} />
        </Input>
    );
}

function getDynamicTableDropdown(options: DropdownProps['options']) {
    return ({ name, onChange, ...rest }: CustomConfigurationComponentProps<string>) => {
        return (
            <Dropdown
                clearable={false}
                selection
                options={options}
                onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
                {...rest}
            />
        );
    };
}

const cloudifyResourceRegexp = /^[a-zA-Z][a-zA-Z0-9._-]*$/;
const staticValueRegexp = /^[a-zA-Z0-9._-]*$/;

const dynamicTableFieldStyle = { height: 38 };

type Columns<T> = TerraformModalTableAccordionProps<T[]>['columns'];

const variablesColumns: Columns<Variable> = [
    {
        id: 'name',
        label: t('variablesTable.name'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: LengthLimitedDynamicTableInput
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

const outputsColumns: Columns<Output> = [
    {
        id: 'name',
        label: t('outputsTable.name'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: LengthLimitedDynamicTableInput
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
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: LengthLimitedDynamicTableInput
    }
];

export function getResourceLocation(templateModules: string[], resourceLocation: string) {
    if (
        _(templateModules)
            .map(modulePath => modulePath.split('/')[0])
            .uniq()
            .size() > 1
    ) {
        return resourceLocation;
    }
    // Remove first dir from the path ('dir1/dir2' -> 'dir2')
    return resourceLocation.replace(/^[^/]*[/]?/, '');
}

export default function TerraformModal({
    onHide,
    toolbox
}: {
    onHide: () => void;
    toolbox: Stage.Types.WidgetlessToolbox;
}) {
    const { useBoolean, useErrors, useInput, useResettableState } = Stage.Hooks;

    const [processPhase, setProcessPhase, stopProcess] = useResettableState<'generation' | 'upload' | null>(null);
    const [cancelConfirmVisible, showCancelConfirm, hideCancelConfirm] = useBoolean();
    const [templateModulesLoading, setTemplateModulesLoading, unsetTemplateModulesLoading] = useBoolean();
    const [templateModules, setTemplateModules, clearTemplateModules] = useResettableState<string[]>([]);

    const { errors, setErrors, setMessageAsError, clearErrors } = useErrors();

    const [version, setVersion] = useInput(defaultVersion);
    const [blueprintName, setBlueprintName] = useInput('');
    const [templateUrl, setTemplateUrl] = useInput('');
    const [resourceLocation, setResourceLocation, clearResourceLocation] = useInput('');
    const [urlAuthentication, setUrlAuthentication] = useInput(false);
    const [username, setUsername, clearUsername] = useInput('');
    const [password, setPassword, clearPassword] = useInput('');
    const [variables, setVariables] = useState<Variable[]>([]);
    const [environment, setEnvironment] = useState<Variable[]>([]);
    const [outputs, setOutputs] = useState<Output[]>([]);

    async function handleSubmit() {
        clearErrors();

        const formErrors: Record<string, string> = {};

        function validateBlueprintName() {
            if (!blueprintName) {
                formErrors.blueprint = tError('noBlueprintName');
            } else if (!blueprintName.match(cloudifyResourceRegexp)) {
                formErrors.blueprint = tError('invalidBlueprintName');
            }
        }

        function validateTemplate() {
            if (!templateUrl) {
                formErrors.template = tError('noTerraformTemplate');
            } else if (!Stage.Utils.Url.isUrl(templateUrl)) {
                formErrors.template = tError('invalidTerraformTemplate');
            }
        }

        function validateResourceLocation() {
            if (!resourceLocation) {
                formErrors.resource = tError('noResourceLocation');
            }
        }

        function validateUrlAuthentication() {
            if (urlAuthentication) {
                if (!username) {
                    formErrors.username = tError('noUsername');
                }
                if (!password) {
                    formErrors.password = tError('noPassword');
                }
            }
        }

        function validateNames(namedEntities: { name: string }[], errorPrefix: string) {
            const tNameError = Stage.Utils.composeT(tError, errorPrefix);
            let nameError = false;
            if (find(namedEntities, variable => isEmpty(variable.name))) {
                formErrors[`${errorPrefix}NameMissing`] = tNameError('nameMissing');
                nameError = true;
            }
            if (
                find(namedEntities, variable => !isEmpty(variable.name) && !variable.name.match(cloudifyResourceRegexp))
            ) {
                formErrors[`${errorPrefix}NameInvalid`] = tNameError('nameInvalid');
                nameError = true;
            }

            if (!nameError && _(namedEntities).keyBy('name').size() !== namedEntities.length) {
                formErrors[`${errorPrefix}NameDuplicated`] = tNameError('nameDuplicated');
            }
        }

        function validateVariables(variablesList: Variable[], errorPrefix: string) {
            validateNames(variablesList, errorPrefix);

            const tVariableError = Stage.Utils.composeT(tError, errorPrefix);

            if (find(variablesList, variable => isEmpty(variable.source))) {
                formErrors[`${errorPrefix}SourceMissing`] = tVariableError('sourceMissing');
            }
            if (
                find(
                    variablesList,
                    variable => isEmpty(variable.value) && (variable.source === 'secret' || variable.source === 'input')
                )
            ) {
                formErrors[`${errorPrefix}ValueMissing`] = tVariableError('valueMissing');
            }
            if (
                find(
                    variablesList,
                    variable =>
                        !isEmpty(variable.value) &&
                        variable.source === 'static' &&
                        !variable.value.match(staticValueRegexp)
                )
            ) {
                formErrors[`${errorPrefix}ValueInvalid`] = tVariableError('staticValueInvalid');
            }
            if (
                find(
                    variablesList,
                    variable =>
                        !isEmpty(variable.value) &&
                        variable.source !== 'static' &&
                        !variable.value.match(cloudifyResourceRegexp)
                )
            ) {
                formErrors[`${errorPrefix}ValueInvalid`] = tVariableError('valueInvalid');
            }
        }

        function validateOutputs() {
            validateNames(outputs, 'output');

            const tOutputError = Stage.Utils.composeT(tError, 'output');

            if (find(outputs, output => isEmpty(output.type))) {
                formErrors.outputTypeMissing = tOutputError('typeMissing');
            }
            if (find(outputs, output => isEmpty(output.terraformOutput))) {
                formErrors.outputMissing = tOutputError('outputMissing');
            }
            if (
                find(
                    outputs,
                    output => !isEmpty(output.terraformOutput) && !output.terraformOutput.match(cloudifyResourceRegexp)
                )
            ) {
                formErrors.outputValueInvalid = tOutputError('outputInvalid');
            }
        }

        validateBlueprintName();
        validateTemplate();
        validateUrlAuthentication();
        validateResourceLocation();
        validateVariables(variables, 'variable');
        validateVariables(environment, 'environmentVariable');
        validateOutputs();

        if (!isEmpty(formErrors)) {
            setErrors(formErrors);
            return;
        }

        const { BlueprintActions } = Stage.Common;

        const existingBlueprintResponse = await new BlueprintActions(toolbox).doGetBlueprints({
            id: blueprintName,
            _include: 'id'
        });
        if (existingBlueprintResponse.items.length) {
            setErrors({ blueprint: tError('blueprintNameInUse', { blueprintName }) });
            return;
        }

        setProcessPhase('generation');

        try {
            const blueprintContent = await new TerraformActions(toolbox).doGenerateBlueprint({
                blueprintName,
                terraformTemplate: templateUrl,
                urlAuthentication,
                terraformVersion: version,
                resourceLocation: getResourceLocation(templateModules, resourceLocation),
                variables,
                environmentVariables: environment,
                outputs
            });

            setProcessPhase('upload');

            if (urlAuthentication) {
                const secretActions = new Stage.Common.SecretActions(toolbox);
                const { defaultVisibility } = Stage.Common.Consts;
                await secretActions.doCreate(`${blueprintName}.username`, username, defaultVisibility, false);
                await secretActions.doCreate(`${blueprintName}.password`, password, defaultVisibility, false);
            }

            const file: any = new Blob([blueprintContent]);
            file.name = Stage.Common.Consts.defaultBlueprintYamlFileName;
            const image = await (await fetch(terraformLogo)).blob();
            await new BlueprintActions(toolbox).doUpload(blueprintName, { file, image });

            toolbox.getEventBus().trigger('blueprints:refresh');
            onHide();
        } catch (e) {
            setMessageAsError(e);
            stopProcess();
        }
    }

    function handleUrlAuthenticationChange(_event: Event, { checked }: CheckboxProps) {
        setUrlAuthentication(checked);
        if (!checked) {
            clearUsername();
            clearPassword();
        }
    }

    function handleTemplateUrlBlur() {
        const authenticationDataIncomplete = urlAuthentication && (!username || !password);
        if (!Stage.Utils.Url.isUrl(templateUrl) || authenticationDataIncomplete) {
            return;
        }

        setTemplateModulesLoading();
        new TerraformActions(toolbox)
            .doGetTemplateModules(templateUrl, username, password)
            .then(loadedTemplateModules => {
                setTemplateModules(loadedTemplateModules);
                setResourceLocation(
                    find(loadedTemplateModules, module => module.indexOf('terraform') >= 0 || module.indexOf('tf') >= 0)
                );
            })
            .catch(err => {
                setErrors({
                    template: err.status === 401 ? tError('terraformTemplateUnauthorized') : err.message
                });
                clearTemplateModules();
                clearResourceLocation();
            })
            .finally(unsetTemplateModulesLoading);
    }

    const { AccordionSectionWithDivider } = Stage.Common;

    const { Accordion, ApproveButton, CancelButton, Confirm, Header, Image, LoadingOverlay, Modal, Form } = Stage.Basic;

    return (
        <Modal open onClose={onHide}>
            {processPhase && <LoadingOverlay message={t(`progress.${processPhase}`)} />}

            <Modal.Header>
                <Image src={terraformLogo} size="mini" inline style={{ width: '2.2em' }} /> {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field label={t(`blueprintName`)} required error={errors.blueprint}>
                        <Form.Input value={blueprintName} onChange={setBlueprintName}>
                            <input maxLength={inputMaxLength} />
                        </Form.Input>
                    </Form.Field>
                    <Form.Field label={t(`terraformVersion`)} required>
                        <Form.Dropdown
                            search
                            selection
                            options={terraformVersionOptions}
                            value={version}
                            onChange={setVersion}
                            clearable={false}
                        />
                    </Form.Field>
                    <Accordion>
                        <AccordionSectionWithDivider title={t('blueprintInformation')} initialActive>
                            {templateModulesLoading && <LoadingOverlay />}
                            <Form.Field label={t(`template`)} required error={errors.template}>
                                <Form.Input
                                    value={templateUrl}
                                    onChange={setTemplateUrl}
                                    onBlur={handleTemplateUrlBlur}
                                />
                            </Form.Field>
                            <Form.Field label={t(`resourceLocation`)} required error={errors.resource}>
                                <Form.Dropdown
                                    selection
                                    options={templateModules.map(moduleLocation => ({
                                        text: moduleLocation,
                                        value: moduleLocation
                                    }))}
                                    value={resourceLocation}
                                    onChange={setResourceLocation}
                                    clearable={false}
                                    disabled={isEmpty(templateModules)}
                                />
                            </Form.Field>
                            <Form.Group widths="equal">
                                <Form.Field>
                                    <Form.Checkbox
                                        toggle
                                        label={t(`urlAuthentication`)}
                                        help={undefined}
                                        checked={urlAuthentication}
                                        onChange={handleUrlAuthenticationChange}
                                    />
                                </Form.Field>
                                <Form.Field error={errors.username}>
                                    <Form.Input
                                        disabled={!urlAuthentication}
                                        value={username}
                                        onChange={setUsername}
                                        label={t(`username`)}
                                        onBlur={handleTemplateUrlBlur}
                                        required={urlAuthentication}
                                    />
                                </Form.Field>
                                <Form.Field error={errors.password}>
                                    <Form.Input
                                        disabled={!urlAuthentication}
                                        value={password}
                                        onChange={setPassword}
                                        label={t(`password`)}
                                        onBlur={handleTemplateUrlBlur}
                                        required={urlAuthentication}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </AccordionSectionWithDivider>
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
