import type { FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CheckboxProps, DropdownProps, InputProps } from 'semantic-ui-react';
import { Ref } from 'semantic-ui-react';
import { chain, entries, head, isEmpty, some } from 'lodash';
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
import type { CustomConfigurationComponentProps } from '../../../utils/StageAPI';
import type { Output, Variable } from '../../../../backend/handler/TerraformHandler.types';
import terraformLogo from '../../../images/terraform_logo.png';
import SinglelineInput from '../secrets/SinglelineInput';
import './TerraformModal.css';
import StageUtils from '../../../utils/stageUtils';
import {
    Accordion,
    ApproveButton,
    CancelButton,
    Confirm,
    Dropdown,
    Form,
    GenericField,
    Header,
    Image,
    LoadingOverlay,
    Modal
} from '../../../components/basic';
import { useBoolean, useFormErrors, useInput, useResettableState } from '../../../utils/hooks';

const t = StageUtils.getT('widgets.blueprints.terraformModal');
const tError = StageUtils.composeT(t, 'errors');

const TerraformLogo = styled(Image)`
    &&& {
        width: 1.8em;
        margin-right: 0.25em;
    }
`;

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

    if (resourceLocation.indexOf('/') >= 0) {
        // Remove first dir from the path ('dir1/dir2' -> 'dir2')
        return resourceLocation.replace(/^[^/]*[/]?/, '');
    }

    return resourceLocation;
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
    const variablesColumns = useMemo<Columns<Variable>>(
        () => [
            {
                id: 'variable',
                label: t('variablesTable.variable'),
                type: GenericField.CUSTOM_TYPE,
                component: LengthLimitedDynamicTableInput,
                width: 3
            },
            {
                id: 'source',
                label: t('variablesTable.source'),
                type: GenericField.CUSTOM_TYPE,
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
                type: GenericField.CUSTOM_TYPE,
                component: TerraformVariableNameInput,
                style: dynamicTableFieldStyle,
                width: 3
            },
            {
                id: 'value',
                label: t('variablesTable.value'),
                type: GenericField.CUSTOM_TYPE,
                component: TerraformVariableValueInput,
                style: dynamicTableFieldStyle
            }
        ],
        undefined
    );

    const outputsColumns = useMemo<Columns<Output>>(
        () => [
            {
                id: 'name',
                label: t('outputsTable.name'),
                type: GenericField.CUSTOM_TYPE,
                component: LengthLimitedDynamicTableInput
            },
            {
                id: 'type',
                label: t('outputsTable.type'),
                type: GenericField.CUSTOM_TYPE,
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
                type: GenericField.CUSTOM_TYPE,
                component: LengthLimitedDynamicTableInput
            }
        ],
        undefined
    );

    const terraformVersionOptions = useMemo(
        () =>
            terraformVersions.map(versionOption => ({
                text: versionOption === defaultVersion ? `${versionOption} (${t('default')})` : versionOption,
                value: versionOption
            })),
        undefined
    );

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

    function clearFieldError(fieldName: string) {
        setFieldError(fieldName);
    }

    useEffect(
        function setFocusOnUsernameInput() {
            if (urlAuthentication && !username) {
                usernameInputRef.current?.getElementsByTagName('input')[0].focus();
            }
        },
        [urlAuthentication, username]
    );

    useEffect(() => {
        if (!resourceLocation) {
            return;
        }
        clearFieldError('resource');

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

        if (terraformTemplatePackageBase64) {
            setTemplateModulesLoading();
            new TerraformActions(toolbox)
                .doGetOutputsAndVariablesByFile(terraformTemplatePackageBase64, resourceLocation)
                .then(setOutputsAndVariables);
        } else if (templateUrl) {
            setTemplateModulesLoading();
            new TerraformActions(toolbox)
                .doGetOutputsAndVariablesByURL(templateUrl, resourceLocation, username, password)
                .then(setOutputsAndVariables);
        }
    }, [terraformTemplatePackageBase64, resourceLocation]);

    function assignDeferredVariablesAndOutputs() {
        if (outputsDeferred.length) {
            setOutputs(outputsDeferred);
            setOutputsDeferred([]);
            validateOutputs(outputsDeferred);
        }
        if (variablesDeferred.length) {
            setVariables(variablesDeferred);
            setVariablesDeferred([]);
            validateVariables(variablesDeferred, 'variables');
        }
    }

    function validateIDs(
        entities: Record<string, any>[],
        type: string,
        IDkey: 'variable' | 'name' = 'variable',
        setFormError: typeof setFieldError
    ): void {
        const tNameError = Stage.Utils.composeT(tError, type);

        entities.forEach((variable, index) => {
            if (isEmpty(variable[IDkey])) {
                setFormError(`${type}_${index}_${IDkey}`, tNameError('keyMissing'));
            } else if (!variable[IDkey].match(validationRegExp)) {
                setFormError(`${type}_${index}_${IDkey}`, tNameError('keyInvalid'));
            } else if (
                some(entities, (entity, entityIndex) => entityIndex !== index && entity[IDkey] === variable[IDkey])
            ) {
                setFormError(`${type}_${index}_${IDkey}`, tNameError('keyDuplicated'));
            }
        });
    }

    function validateVariablesSource(
        variablesList: Variable[],
        variableType: string,
        setFormError: typeof setFieldError
    ) {
        variablesList.forEach((variable, index) => {
            const variableIndex = `${variableType}_${index}_source`;
            const hasError = getFieldError(variableIndex);
            const tVariableError = Stage.Utils.composeT(tError, variableType);

            if (isEmpty(variable.source)) {
                setFormError(variableIndex, tVariableError('sourceMissing'));
            } else if (hasError) {
                clearFieldError(variableIndex);
            }
        });
    }

    function validateVariablesName(
        variablesList: Variable[],
        variableType: string,
        setFormError: typeof setFieldError
    ) {
        variablesList.forEach((variable, index) => {
            const variableIndex = `${variableType}_${index}_name`;
            const hasError = getFieldError(variableIndex);
            const tVariableError = Stage.Utils.composeT(tError, variableType);

            if (isEmpty(variable.name)) {
                setFormError(variableIndex, tVariableError('nameMissing'));
            } else if (!variable.name.match(validationStrictRegExp)) {
                setFormError(variableIndex, tVariableError('nameInvalid'));
            } else if (hasError) {
                clearFieldError(variableIndex);
            }
        });
    }

    function validateVariables(variablesList: Variable[], variableType: string, setFormError = setFieldError) {
        validateIDs(variablesList, variableType, undefined, setFormError);
        validateVariablesSource(variablesList, variableType, setFormError);
        validateVariablesName(variablesList, variableType, setFormError);
    }

    function validateOutputsType(outputsList: Output[], setFormError: typeof setFieldError) {
        outputsList.forEach((output, index) => {
            const outputIndex = `outputs_${index}_type`;
            const hasError = getFieldError(outputIndex);
            const tOutputError = Stage.Utils.composeT(tError, 'outputs');

            if (isEmpty(output.type)) {
                setFormError(outputIndex, tOutputError('typeMissing'));
            } else if (hasError) {
                clearFieldError(outputIndex);
            }
        });
    }

    function validateOutputsTerraformOutput(outputsList: Output[], setFormError: typeof setFieldError) {
        outputsList.forEach((output, index) => {
            const outputIndex = `outputs_${index}_terraformOutput`;
            const hasError = getFieldError(outputIndex);
            const tOutputError = Stage.Utils.composeT(tError, 'outputs');

            if (isEmpty(output.terraformOutput)) {
                setFormError(outputIndex, tOutputError('outputMissing'));
            } else if (!output.terraformOutput.match(validationStrictRegExp)) {
                setFormError(outputIndex, tOutputError('outputInvalid'));
            } else if (hasError) {
                clearFieldError(outputIndex);
            }
        });
    }

    function validateOutputs(outputsList = outputs, setFormError = setFieldError) {
        validateIDs(outputs, 'outputs', 'name', setFormError);
        validateOutputsType(outputsList, setFormError);
        validateOutputsTerraformOutput(outputsList, setFormError);
    }

    async function handleSubmit() {
        cleanFormErrors();

        let formHasErrors = false;

        const setFormError: typeof setFieldError = (...setFieldErrorArguments) => {
            formHasErrors = true;
            return setFieldError(...setFieldErrorArguments);
        };

        function validateBlueprintName() {
            if (!blueprintName) {
                setFormError('blueprintName', tError('noBlueprintName'));
            } else if (!blueprintName.match(validationStrictRegExp)) {
                setFormError('blueprintName', tError('invalidBlueprintName'));
            }
        }

        function validateBlueprintDescription() {
            const descriptionValidationRegexp = /^[ -~\s]*$/;

            if (!blueprintDescription.match(descriptionValidationRegexp)) {
                setFormError('blueprintDescription', tError('invalidBlueprintDescription'));
            }
        }

        function validateTemplate() {
            if (!terraformTemplatePackage) {
                if (!templateUrl) {
                    setFormError('template', tError('noTerraformTemplate'));
                } else if (!Stage.Utils.Url.isUrl(templateUrl)) {
                    setFormError('template', tError('invalidTerraformTemplate'));
                }
            }
        }

        function validateResourceLocation() {
            if (!resourceLocation) {
                setFormError('resource', tError('noResourceLocation'));
            }
        }

        function validateUrlAuthentication() {
            if (urlAuthentication) {
                if (!username) {
                    setFormError('username', tError('noUsername'));
                }
                if (!password) {
                    setFormError('password', tError('noPassword'));
                }
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
        validateOutputs(undefined, setFormError);
        validateVariables(variables, 'variables', setFormError);
        validateVariables(environment, 'environmentVariables', setFormError);

        if (formHasErrors) {
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
        setResourceLocation(head(loadedTemplateModules));

        clearFieldError('template');
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
                        <AccordionSectionWithDivider title={t('terraformModuleDetails')} initialActive>
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
                content={Stage.Utils.renderMultilineText(
                    t('assignOutputsVariablesConfirm', {
                        variablesAmount: variablesDeferred.length,
                        outputAmount: outputsDeferred.length
                    })
                )}
                onConfirm={assignDeferredVariablesAndOutputs}
                onCancel={() => {
                    setOutputsDeferred([]);
                    setVariablesDeferred([]);
                }}
            />
        </Modal>
    );
}
