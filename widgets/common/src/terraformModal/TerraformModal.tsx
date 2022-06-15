import React, { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { CheckboxProps, DropdownProps } from 'semantic-ui-react';
import { Ref } from 'semantic-ui-react';
import { chain, find, some, isEmpty, entries } from 'lodash';
import styled from 'styled-components';
import BlueprintActions from '../blueprints/BlueprintActions';
import AccordionSectionWithDivider from '../components/accordion/AccordionSectionWithDivider';
import Consts from '../Consts';
import SecretActions from '../secrets/SecretActions';
import type { TerraformModalTableAccordionProps } from './TerraformModalTableAccordion';
import TerraformModalTableAccordion from './TerraformModalTableAccordion';
import TerraformVariableNameInput from './TerraformVariableNameInput';
import TerraformActions from './TerraformActions';
import terraformVersions, { defaultVersion } from './terraformVersions';
import type { CustomConfigurationComponentProps } from '../../../../app/utils/StageAPI';
import type { Variable, Output } from '../../../../backend/routes/Terraform.types';
import terraformLogo from '../../../../app/images/terraform_logo.png';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');
const tError = Stage.Utils.composeT(t, 'errors');

const { Dropdown, Input, Accordion, ApproveButton, CancelButton, Confirm, Header, Image, LoadingOverlay, Modal, Form } =
    Stage.Basic;

const TerraformLogo = styled(Image)`
    &&& {
        width: 1.8em;
        margin-right: 0.25em;
    }
`;

const terraformVersionOptions = terraformVersions.map(versionOption => ({
    text: versionOption === defaultVersion ? `${versionOption} (${t('default')})` : versionOption,
    value: versionOption
}));

export const inputMaxLength = 256;

function LengthLimitedDynamicTableInput({ name, onChange, ...rest }: CustomConfigurationComponentProps<string>) {
    return (
        <Input
            name={name}
            fluid
            onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
            {...rest}
        >
            <input maxLength={inputMaxLength} />
        </Input>
    );
}

interface TerraformVariableValueInputProps extends CustomConfigurationComponentProps<string> {
    rowValues?: Variable;
}

function TerraformVariableValueInput({ name, onChange, rowValues, value, ...rest }: TerraformVariableValueInputProps) {
    return (
        <Input
            type={rowValues?.source === 'secret' ? 'password' : 'text'}
            disabled={rowValues?.duplicated}
            name={name}
            fluid
            onChange={(event, { value: valuePassed }) => onChange?.(event, { name, value: valuePassed as string })}
            value={rowValues?.duplicated ? '' : value}
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
                fluid
                selection
                options={options}
                onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
                {...rest}
            />
        );
    };
}

const validationStrictRegExp = /^[a-zA-Z][a-zA-Z0-9._-]*$/;

const validationRegExp = /^[a-zA-Z0-9._-]*$/;

const dynamicTableFieldStyle = { height: 38 };

type Columns<T> = TerraformModalTableAccordionProps<T[]>['columns'];

const variablesColumns: Columns<Variable> = [
    {
        id: 'variable',
        label: t('variablesTable.variable'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: LengthLimitedDynamicTableInput,
        width: 3
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
        style: dynamicTableFieldStyle,
        width: 3
    },
    {
        id: 'name',
        label: t('variablesTable.name'),
        type: Stage.Basic.GenericField.CUSTOM_TYPE,
        component: TerraformVariableNameInput,
        style: dynamicTableFieldStyle,
        width: 3
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
        chain(templateModules)
            .map(modulePath => modulePath.split('/')[0])
            .uniq()
            .size()
            .value() > 1
    ) {
        return resourceLocation;
    }
    // Remove first dir from the path ('dir1/dir2' -> 'dir2')
    return resourceLocation.replace(/^[^/]*[/]?/, '');
}

function markDuplicates(
    variables: Variable[],
    environment: Variable[],
    setVariables: (v: Variable[]) => void,
    setEnvironment: (v: Variable[]) => void
) {
    const existingInputs: string[] = [];
    const existingSecrets: string[] = [];

    function markDuplicatesForEachIterator(row: Variable, key: number, array: Variable[]) {
        if (row.source === 'input') {
            if (existingInputs.includes(row.name)) {
                array[key].duplicated = true;
            } else {
                array[key].duplicated = false;
                existingInputs.push(row.name);
            }
        } else if (row.source === 'secret') {
            if (existingSecrets.includes(row.name)) {
                array[key].duplicated = true;
            } else {
                array[key].duplicated = false;
                existingSecrets.push(row.name);
            }
        } else {
            array[key].duplicated = false;
        }
    }

    variables.forEach(markDuplicatesForEachIterator);
    environment.forEach(markDuplicatesForEachIterator);

    setEnvironment(environment);
    setVariables(variables);
}

export default function TerraformModal({ onHide, toolbox }: { onHide: () => void; toolbox: Stage.Types.Toolbox }) {
    const { useBoolean, useErrors, useInput, useResettableState } = Stage.Hooks;

    const [processPhase, setProcessPhase, stopProcess] = useResettableState<'generation' | 'upload' | null>(null);
    const [cancelConfirmVisible, showCancelConfirm, hideCancelConfirm] = useBoolean();
    const [templateModulesLoading, setTemplateModulesLoading, unsetTemplateModulesLoading] = useBoolean();
    const [templateModules, setTemplateModules, clearTemplateModules] = useResettableState<string[]>([]);

    const { errors, setErrors, setMessageAsError, clearErrors } = useErrors();

    const [version, setVersion] = useInput(defaultVersion);
    const [blueprintName, setBlueprintName] = useInput('');
    const [blueprintDescription, setBlueprintDescription] = useInput('');

    const [templateUrl, setTemplateUrl] = useInput('');
    const [terraformTemplatePackage, setTerraformTemplatePackage] = useState<File>();
    const [terraformTemplatePackageBase64, setTerraformTemplatePackageBase64] = useState<string>();
    const [resourceLocation, setResourceLocation, clearResourceLocation] = useInput('');
    const [urlAuthentication, setUrlAuthentication] = useInput(false);
    const [username, setUsername, clearUsername] = useInput('');
    const [password, setPassword, clearPassword] = useInput('');
    const [variables, setVariables] = useState<Variable[]>([]);
    const [environment, setEnvironment] = useState<Variable[]>([]);
    const [outputs, setOutputs] = useState<Output[]>([]);
    const [variablesDeferred, setVariablesDeferred] = useState<Variable[]>([]);
    const [outputsDeferred, setOutputsDeferred] = useState<Output[]>([]);

    const usernameInputRef = useRef<HTMLInputElement>(null);

    useEffect(
        function setFocusOnUsernameInput() {
            if (urlAuthentication && !username) {
                usernameInputRef.current?.getElementsByTagName('input')[0].focus();
            }
        },
        [urlAuthentication, username]
    );

    useEffect(
        function getVariablesAndOutputsOnSourceChange() {
            if (!resourceLocation) {
                return;
            }

            function setOutputsAndVariables({ outputs: outputsResponse, variables: variablesResponse }: any) {
                const outputsTmp: Output[] = entries(outputsResponse).map(([, outputObj]: any) => ({
                    name: outputObj.name,
                    type: 'capability',
                    terraformOutput: ''
                }));
                const variablesTmp: Variable[] = entries(variablesResponse).map(([key, variableObj]: any) => ({
                    variable: key,
                    name: variableObj.name,
                    source: 'input',
                    value: ''
                }));

                setOutputsDeferred(outputsTmp);
                setVariablesDeferred(variablesTmp);
                unsetTemplateModulesLoading();
            }

            setTemplateModulesLoading();
            if (terraformTemplatePackageBase64) {
                new TerraformActions(toolbox)
                    .doGetOutputsAndVariablesByFile(terraformTemplatePackageBase64, resourceLocation)
                    .then(setOutputsAndVariables);
            } else if (templateUrl) {
                new TerraformActions(toolbox)
                    .doGetOutputsAndVariablesByURL(templateUrl, resourceLocation, username, password)
                    .then(setOutputsAndVariables);
            }
        },
        [resourceLocation]
    );

    function assignDeferredVariablesAndOutputs() {
        if (outputsDeferred.length) {
            setOutputs(outputsDeferred);
            setOutputsDeferred([]);
        }
        if (variablesDeferred.length) {
            setVariables(variablesDeferred);
            setVariablesDeferred([]);
        }
    }

    async function handleSubmit() {
        clearErrors();

        const formErrors: Record<string, string> = {};

        function validateBlueprintName() {
            if (!blueprintName) {
                formErrors.blueprint = tError('noBlueprintName');
            } else if (!blueprintName.match(validationStrictRegExp)) {
                formErrors.blueprint = tError('invalidBlueprintName');
            }
        }

        function validateBlueprintDescription() {
            const descriptionValidationRegexp = /^[ -~\s]*$/;

            if (!blueprintDescription.match(descriptionValidationRegexp)) {
                formErrors.blueprintDescription = tError('invalidBlueprintDescription');
            }
        }

        function validateTemplate() {
            if (!terraformTemplatePackage) {
                if (!templateUrl) {
                    formErrors.template = tError('noTerraformTemplate');
                } else if (!Stage.Utils.Url.isUrl(templateUrl)) {
                    formErrors.template = tError('invalidTerraformTemplate');
                }
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

        function validateIDs(
            entities: Record<string, any>[],
            errorPrefix: string,
            IDkey: 'variable' | 'name' = 'variable'
        ): void {
            const tNameError = Stage.Utils.composeT(tError, errorPrefix);
            let keyError = false;
            if (some(entities, variable => isEmpty(variable[IDkey]))) {
                formErrors[`${errorPrefix}KeyMissing`] = tNameError('keyMissing');
                keyError = true;
            }
            if (some(entities, variable => !isEmpty(variable[IDkey]) && !variable[IDkey].match(validationRegExp))) {
                formErrors[`${errorPrefix}KeyInvalid`] = tNameError('keyInvalid');
                keyError = true;
            }

            if (!keyError && chain(entities).keyBy(IDkey).size().value() !== entities.length) {
                formErrors[`${errorPrefix}KeyDuplicated`] = tNameError('keyDuplicated');
            }
        }

        function validateVariables(variablesList: Variable[], errorPrefix: string) {
            validateIDs(variablesList, errorPrefix);

            const tVariableError = Stage.Utils.composeT(tError, errorPrefix);

            if (some(variablesList, variable => isEmpty(variable.source))) {
                formErrors[`${errorPrefix}SourceMissing`] = tVariableError('sourceMissing');
            }
            if (
                some(
                    variablesList,
                    variable => isEmpty(variable.name) && (variable.source === 'secret' || variable.source === 'input')
                )
            ) {
                formErrors[`${errorPrefix}NameMissing`] = tVariableError('nameMissing');
            }
            if (
                some(
                    variablesList,
                    variable =>
                        !isEmpty(variable.name) &&
                        variable.source !== 'static' &&
                        !variable.name.match(validationStrictRegExp)
                )
            ) {
                formErrors[`${errorPrefix}NameInvalid`] = tVariableError('nameInvalid');
            }
        }

        function validateOutputs() {
            validateIDs(outputs, 'output', 'name');

            const tOutputError = Stage.Utils.composeT(tError, 'output');

            if (some(outputs, output => isEmpty(output.type))) {
                formErrors.outputTypeMissing = tOutputError('typeMissing');
            }
            if (some(outputs, output => isEmpty(output.terraformOutput))) {
                formErrors.outputMissing = tOutputError('outputMissing');
            }
            if (
                some(
                    outputs,
                    output => !isEmpty(output.terraformOutput) && !output.terraformOutput.match(validationStrictRegExp)
                )
            ) {
                formErrors.outputValueInvalid = tOutputError('outputInvalid');
            }
        }

        async function createSecretsFromVariables() {
            const secretActions = new SecretActions(toolbox);
            const { defaultVisibility } = Consts;
            const allSecretVariables: Variable[] = [...variables, ...environment].filter(
                variable => variable.source === 'secret'
            );

            await allSecretVariables
                .filter(secretVar => !secretVar.duplicated)
                .forEach(async secretVariable => {
                    // add secret if not exist
                    await secretActions.doGet(secretVariable.name).catch(async () => {
                        await secretActions.doCreate(
                            secretVariable.name,
                            secretVariable.value,
                            defaultVisibility,
                            false
                        );
                    });
                });
        }

        validateBlueprintName();
        validateBlueprintDescription();
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
            let blueprintContent: any;
            if (terraformTemplatePackageBase64) {
                blueprintContent = await (
                    await new TerraformActions(toolbox).doGenerateBlueprintArchive({
                        blueprintName,
                        blueprintDescription,
                        file: terraformTemplatePackageBase64,
                        urlAuthentication,
                        terraformVersion: version,
                        resourceLocation: getResourceLocation(templateModules, resourceLocation),
                        variables,
                        environmentVariables: environment,
                        outputs
                    })
                ).blob();
                blueprintContent.name = 'blueprint.zip';
            } else {
                blueprintContent = new Blob([
                    await new TerraformActions(toolbox).doGenerateBlueprint({
                        blueprintName,
                        blueprintDescription,
                        terraformTemplate: templateUrl,
                        urlAuthentication,
                        terraformVersion: version,
                        resourceLocation: getResourceLocation(templateModules, resourceLocation),
                        variables,
                        environmentVariables: environment,
                        outputs
                    })
                ]);
                blueprintContent.name = Consts.defaultBlueprintYamlFileName;
            }

            setProcessPhase('upload');

            if (urlAuthentication) {
                const secretActions = new SecretActions(toolbox);
                const { defaultVisibility } = Consts;
                await secretActions.doCreate(`${blueprintName}.username`, username, defaultVisibility, false);
                await secretActions.doCreate(`${blueprintName}.password`, password, defaultVisibility, false);
            }

            const file: Blob & { name: string } = blueprintContent;

            const image = await (await fetch(terraformLogo)).blob();
            await createSecretsFromVariables();
            await new BlueprintActions(toolbox).doUpload(blueprintName, {
                file,
                image,
                blueprintYamlFile: Consts.defaultBlueprintYamlFileName
            });

            toolbox.drillDown(
                toolbox.getWidget(),
                'blueprint',
                { blueprintId: blueprintName, openDeploymentModal: true },
                blueprintName
            );
        } catch (e: any) {
            setMessageAsError(e);
            stopProcess();
        }
    }

    function handleUrlAuthenticationChange(_event: FormEvent<HTMLInputElement>, { checked }: CheckboxProps) {
        setUrlAuthentication(checked);
        if (!checked) {
            clearUsername();
            clearPassword();
        }
    }

    function reloadTemplateModules(loadedTemplateModules: any) {
        setTemplateModules(loadedTemplateModules);
        setResourceLocation(
            find(loadedTemplateModules, module => module.indexOf('terraform') >= 0 || module.indexOf('tf') >= 0)
        );

        const { template, ...modalErrors } = errors;
        setErrors(modalErrors);
    }

    function catchTemplateModulesLoadingError(err: any) {
        if (err.status === 401) {
            if (!urlAuthentication) {
                setUrlAuthentication(true);
            } else {
                setErrors({
                    template: tError('terraformTemplateUnauthorized')
                });
            }
        } else {
            setErrors({ template: err.message });
        }
        clearTemplateModules();
        clearResourceLocation();
    }

    function handleTemplateUrlBlur() {
        const authenticationDataIncomplete = urlAuthentication && (!username || !password);
        if (!Stage.Utils.Url.isUrl(templateUrl) || authenticationDataIncomplete) {
            return;
        }

        setTemplateModulesLoading();
        new TerraformActions(toolbox)
            .doGetTemplateModulesByUrl(templateUrl, username, password)
            .then(reloadTemplateModules)
            .catch(catchTemplateModulesLoadingError)
            .finally(unsetTemplateModulesLoading);
    }

    const onTerraformTemplatePackageChange = (file?: File) => {
        setTemplateModulesLoading();
        setTerraformTemplatePackage(file);
        if (!file) {
            setTerraformTemplatePackageBase64('');
            clearTemplateModules();
            unsetTemplateModulesLoading();
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function onloadend() {
            setTerraformTemplatePackageBase64(reader.result?.toString());
        };
        new TerraformActions(toolbox)
            .doGetTemplateModulesByFile(file)
            .then(reloadTemplateModules)
            .catch(catchTemplateModulesLoadingError)
            .finally(unsetTemplateModulesLoading);
    };

    function handleVariablesChange(modifiedVariables: Variable[]) {
        return markDuplicates([...modifiedVariables], [...environment], setVariables, setEnvironment);
    }

    function handleEnvironmentChange(modifiedEnvironment: Variable[]) {
        return markDuplicates([...variables], [...modifiedEnvironment], setVariables, setEnvironment);
    }

    return (
        <Modal open onClose={onHide}>
            {processPhase && <LoadingOverlay message={t(`progress.${processPhase}`)} />}

            <Modal.Header>
                <TerraformLogo src={terraformLogo} size="mini" inline /> {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form errors={errors} scrollToError onErrorsDismiss={clearErrors}>
                    <Form.Field label={t(`blueprintName`)} required error={errors.blueprint}>
                        <Form.Input value={blueprintName} onChange={setBlueprintName}>
                            <input maxLength={inputMaxLength} />
                        </Form.Input>
                    </Form.Field>
                    <Form.Field label={t(`blueprintDescription`)} error={errors.blueprintDescription}>
                        <Form.TextArea
                            name="blueprintDescription"
                            value={blueprintDescription}
                            onChange={setBlueprintDescription}
                            rows={5}
                        />
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
                                <Form.UrlOrFile
                                    name="terraformUrlOrFile"
                                    placeholder={t(`template`)}
                                    onChangeUrl={setTemplateUrl}
                                    onBlurUrl={handleTemplateUrlBlur}
                                    onChangeFile={onTerraformTemplatePackageChange}
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
                                    <Ref innerRef={usernameInputRef}>
                                        <Form.Input
                                            disabled={!urlAuthentication}
                                            value={username}
                                            onChange={setUsername}
                                            label={t(`username`)}
                                            onBlur={handleTemplateUrlBlur}
                                            required={urlAuthentication}
                                        />
                                    </Ref>
                                </Form.Field>
                                <Form.Field error={errors.password}>
                                    <Form.Input
                                        disabled={!urlAuthentication}
                                        value={password}
                                        onChange={setPassword}
                                        label={t(`password`)}
                                        onBlur={handleTemplateUrlBlur}
                                        required={urlAuthentication}
                                        type="password"
                                    />
                                </Form.Field>
                            </Form.Group>
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
                        </AccordionSectionWithDivider>
                        <Header size="tiny">{t('mapping')}</Header>
                        <TerraformModalTableAccordion
                            title={t('variables')}
                            value={variables}
                            onChange={handleVariablesChange}
                            columns={variablesColumns}
                            toolbox={toolbox}
                        />
                        <TerraformModalTableAccordion
                            title={t('environment')}
                            value={environment}
                            onChange={handleEnvironmentChange}
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
            <Confirm
                open={!!(outputsDeferred.length || variablesDeferred.length)}
                content={t('assignOutputsVariablesConfirm', {
                    variablesAmount: variablesDeferred.length,
                    outputAmount: outputsDeferred.length
                })}
                onConfirm={assignDeferredVariablesAndOutputs}
                onCancel={() => {
                    setOutputsDeferred([]);
                    setVariablesDeferred([]);
                }}
            />
        </Modal>
    );
}
