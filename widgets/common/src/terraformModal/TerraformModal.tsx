import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { FormEvent } from 'react';
import type { CheckboxProps, DropdownProps, InputProps } from 'semantic-ui-react';
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
import SinglelineInput from '../secrets/SinglelineInput';
import './TerraformModal.css';

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');
const tError = Stage.Utils.composeT(t, 'errors');

const { useBoolean, useInput, useResettableState, useFormErrors } = Stage.Hooks;
const { Dropdown, Accordion, ApproveButton, CancelButton, Confirm, Header, Image, LoadingOverlay, Modal, Form } =
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

function LengthLimitedDynamicTableInput({
    name,
    onChange,
    idPrefix,
    index,
    ...rest
}: CustomConfigurationComponentProps<string>) {
    const { getFieldError } = useFormErrors('terraformModal');

    return (
        <Form.Input
            name={name}
            fluid
            onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
            error={getFieldError(`${idPrefix}_${index}_${name}`)}
            {...rest}
        >
            <input maxLength={inputMaxLength} />
        </Form.Input>
    );
}

interface TerraformVariableValueInputProps extends CustomConfigurationComponentProps<string> {
    rowValues?: Variable;
}

function TerraformVariableValueInput({
    name,
    onChange,
    rowValues,
    value,
    idPrefix,
    index,
    ...rest
}: TerraformVariableValueInputProps) {
    const showSinglelineInput = rowValues?.source === 'secret';
    const { getFieldError } = useFormErrors('terraformModal');
    const InputComponent = showSinglelineInput ? SinglelineInput : Form.Input;

    const handleChange: InputProps['onChange'] = (event, { value: valuePassed }) => {
        onChange?.(event, { name, value: valuePassed });
    };

    return (
        <InputComponent
            disabled={rowValues?.duplicated}
            name={name}
            error={getFieldError(`${idPrefix}_${index}_${name}`)}
            fluid
            onChange={handleChange}
            maxLength={inputMaxLength}
            value={rowValues?.duplicated ? '' : value}
            {...rest}
        />
    );
}

function getDynamicTableDropdown(options: DropdownProps['options']) {
    return ({ name, onChange, idPrefix, index, ...rest }: CustomConfigurationComponentProps<string>) => {
        const { getFieldError } = useFormErrors('terraformModal');

        return (
            <Form.Field error={getFieldError(`${idPrefix}_${index}_${name}`)}>
                <Dropdown
                    clearable={false}
                    fluid
                    selection
                    options={options}
                    onChange={(event, { value }) => onChange?.(event, { name, value: value as string })}
                    {...rest}
                />
            </Form.Field>
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
interface ExistingVariableNames {
    input: string[];
    secret: string[];
}

/**
 * The function set Variable.duplicated state inside of environment Variable and variable Variable.
 * The duplicated state is set based on the following rules for secret and input Variable.source separately:
 *  if certain variable.name is first time present in the table of Variables mark variable.duplicated as false.
 *      otherwise mark as true.
 *  if variable.source is different than 'input' or 'secret' mark variable.duplicated as false
 */
function markDuplicates(
    variables: Variable[],
    environment: Variable[],
    setVariables: (v: Variable[]) => void,
    setEnvironment: (v: Variable[]) => void
) {
    const existing: ExistingVariableNames = {
        input: [],
        secret: []
    };

    function markItemDuplicated(variable: Variable, existingArray: string[]) {
        if (existingArray.includes(variable.name)) {
            variable.duplicated = true;
        } else {
            variable.duplicated = false;
            existingArray.push(variable.name);
        }
    }

    function markDuplicatesForEachIterator(row: Variable, key: number, array: Variable[]) {
        if (row.source === 'input' || row.source === 'secret') {
            markItemDuplicated(array[key], existing[row.source]);
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
    const [processPhase, setProcessPhase, stopProcess] = useResettableState<'generation' | 'upload' | null>(null);
    const [cancelConfirmVisible, showCancelConfirm, hideCancelConfirm] = useBoolean();
    const [templateModulesLoading, setTemplateModulesLoading, unsetTemplateModulesLoading] = useBoolean();
    const [templateModules, setTemplateModules, clearTemplateModules] = useResettableState<string[]>([]);

    const { getFieldError, setFieldError, cleanFormErrors, fieldErrors } = useFormErrors('terraformModal');
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

    const formHeaderErrors = useMemo(() => (fieldErrors ? [] : undefined), [fieldErrors]);

    const handleOnHideModal = useCallback(() => {
        cleanFormErrors();
        onHide();
    }, [onHide, cleanFormErrors]);

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
            setFieldError('resource');

            function setOutputsAndVariables({ outputs: outputsResponse, variables: variablesResponse }: any) {
                const outputsTmp: Output[] = entries(outputsResponse).map(([, outputObj]: any) => ({
                    name: outputObj.name,
                    type: 'capability',
                    terraformOutput: outputObj.name
                }));
                const variablesTmp: Variable[] = entries(variablesResponse).map(([key, variableObj]: any) => ({
                    variable: key,
                    name: variableObj.name,
                    source: 'input',
                    value: '',
                    duplicated: false
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
        cleanFormErrors();

        let formErrors = false;

        function validateBlueprintName() {
            if (!blueprintName) {
                formErrors = true;
                setFieldError('blueprintName', tError('noBlueprintName'));
            } else if (!blueprintName.match(validationStrictRegExp)) {
                formErrors = true;
                setFieldError('blueprintName', tError('invalidBlueprintName'));
            }
        }

        function validateBlueprintDescription() {
            const descriptionValidationRegexp = /^[ -~\s]*$/;

            if (!blueprintDescription.match(descriptionValidationRegexp)) {
                formErrors = true;
                setFieldError('blueprintDescription', tError('invalidBlueprintDescription'));
            }
        }

        function validateTemplate() {
            if (!terraformTemplatePackage) {
                if (!templateUrl) {
                    formErrors = true;
                    setFieldError('template', tError('noTerraformTemplate'));
                } else if (!Stage.Utils.Url.isUrl(templateUrl)) {
                    formErrors = true;
                    setFieldError('template', tError('invalidTerraformTemplate'));
                }
            }
        }

        function validateResourceLocation() {
            if (!resourceLocation) {
                formErrors = true;
                setFieldError('resource', tError('noResourceLocation'));
            }
        }

        function validateUrlAuthentication() {
            if (urlAuthentication) {
                if (!username) {
                    formErrors = true;
                    setFieldError('username', tError('noUsername'));
                }
                if (!password) {
                    formErrors = true;
                    setFieldError('password', tError('noPassword'));
                }
            }
        }

        function validateIDs(
            entities: Record<string, any>[],
            type: string,
            IDkey: 'variable' | 'name' = 'variable'
        ): void {
            const tNameError = Stage.Utils.composeT(tError, type);

            entities.forEach((variable, index) => {
                if (isEmpty(variable[IDkey])) {
                    formErrors = true;
                    setFieldError(`${type}_${index}_${IDkey}`, tNameError('keyMissing'));
                } else if (!variable[IDkey].match(validationRegExp)) {
                    formErrors = true;
                    setFieldError(`${type}_${index}_${IDkey}`, tNameError('keyInvalid'));
                } else if (
                    some(entities, (entity, entityIndex) => entityIndex !== index && entity[IDkey] === variable[IDkey])
                ) {
                    formErrors = true;
                    setFieldError(`${type}_${index}_${IDkey}`, tNameError('keyDuplicated'));
                }
            });
        }

        function validateVariables(variablesList: Variable[], type: string) {
            validateIDs(variablesList, type);

            const tVariableError = Stage.Utils.composeT(tError, type);

            variablesList.forEach((variable, index) => {
                if (isEmpty(variable.source)) {
                    formErrors = true;
                    setFieldError(`${type}_${index}_source`, tVariableError('sourceMissing'));
                } else if (variable.source !== 'static') {
                    if (isEmpty(variable.name)) {
                        formErrors = true;
                        setFieldError(`${type}_${index}_name`, tVariableError('nameMissing'));
                    } else if (!variable.name.match(validationStrictRegExp)) {
                        formErrors = true;
                        setFieldError(`${type}_${index}_name`, tVariableError('nameInvalid'));
                    }
                }
            });
        }

        function validateOutputs() {
            validateIDs(outputs, 'outputs', 'name');

            const tOutputError = Stage.Utils.composeT(tError, 'outputs');

            outputs.forEach((output: Output, index: number) => {
                if (isEmpty(output.type)) {
                    formErrors = true;
                    setFieldError(`outputs_${index}_type`, tOutputError('typeMissing'));
                }

                if (isEmpty(output.terraformOutput)) {
                    formErrors = true;
                    setFieldError(`outputs_${index}_terraformOutput`, tOutputError('outputMissing'));
                } else if (!output.terraformOutput.match(validationStrictRegExp)) {
                    formErrors = true;
                    setFieldError(`outputs_${index}_terraformOutput`, tOutputError('outputInvalid'));
                }
            });
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
        validateVariables(variables, 'variables');
        validateVariables(environment, 'environmentVariables');
        validateOutputs();

        if (formErrors) {
            return;
        }

        const existingBlueprintResponse = await new BlueprintActions(toolbox).doGetBlueprints({
            id: blueprintName,
            _include: 'id'
        });

        if (existingBlueprintResponse.items.length) {
            setFieldError('blueprintName', tError('blueprintNameInUse', { blueprintName }));
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
            setFieldError('template', e.message);
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

        setFieldError('template');
    }

    function catchTemplateModulesLoadingError(err: any) {
        if (err.status === 401) {
            if (!urlAuthentication) {
                setUrlAuthentication(true);
            } else {
                setFieldError('template', tError('terraformTemplateUnauthorized'));
            }
        } else {
            setFieldError('template', err.message);
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

    const onTerraformTemplatePackageChange = (file: File) => {
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
        <Modal open onClose={handleOnHideModal} id="terraformModal">
            {processPhase && <LoadingOverlay message={t(`progress.${processPhase}`)} />}

            <Modal.Header>
                <TerraformLogo src={terraformLogo} size="mini" inline /> {t('header')}
            </Modal.Header>

            <Modal.Content>
                <Form scrollToError errors={formHeaderErrors}>
                    <Form.Input
                        label={t(`blueprintName`)}
                        required
                        value={blueprintName}
                        onChange={setBlueprintName}
                        error={getFieldError('blueprintName')}
                    >
                        <input maxLength={inputMaxLength} />
                    </Form.Input>
                    <Form.TextArea
                        label={t(`blueprintDescription`)}
                        name="blueprintDescription"
                        value={blueprintDescription}
                        onChange={setBlueprintDescription}
                        rows={4}
                        error={getFieldError('blueprintDescription')}
                    />
                    <Form.Field label={t(`terraformVersion`)} required>
                        <Form.Dropdown
                            required
                            label={t(`terraformVersion`)}
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
                            <Form.Field label={t(`template`)} required error={getFieldError('template')}>
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
                                <Ref innerRef={usernameInputRef}>
                                    <Form.Input
                                        error={getFieldError('username')}
                                        disabled={!urlAuthentication}
                                        value={username}
                                        onChange={setUsername}
                                        label={t(`username`)}
                                        onBlur={handleTemplateUrlBlur}
                                        required={urlAuthentication}
                                    />
                                </Ref>
                                <Form.Input
                                    error={getFieldError('password')}
                                    disabled={!urlAuthentication}
                                    value={password}
                                    onChange={setPassword}
                                    label={t(`password`)}
                                    onBlur={handleTemplateUrlBlur}
                                    required={urlAuthentication}
                                    type="password"
                                />
                            </Form.Group>
                            <Form.Field label={t(`resourceLocation`)} required error={getFieldError('resource')}>
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
                            idPrefix="variables"
                            onChange={handleVariablesChange}
                            columns={variablesColumns}
                            toolbox={toolbox}
                        />
                        <TerraformModalTableAccordion
                            title={t('environment')}
                            value={environment}
                            idPrefix="environmentVariables"
                            onChange={handleEnvironmentChange}
                            columns={variablesColumns}
                            toolbox={toolbox}
                        />
                        <TerraformModalTableAccordion
                            title={t('outputs')}
                            value={outputs}
                            idPrefix="outputs"
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
                onConfirm={handleOnHideModal}
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
