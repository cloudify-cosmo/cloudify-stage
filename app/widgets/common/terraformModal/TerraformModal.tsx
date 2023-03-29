import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { InputProps } from 'semantic-ui-react';
import { chain, entries, get, head, isEmpty, omit, set, some } from 'lodash';
import { Credentials, OptionalCredentialsInput } from 'cloudify-ui-components';
import styled from 'styled-components';
import type { Output, Variable } from 'backend/handler/TerraformHandler.types';
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
import terraformLogo from '../../../images/terraform_logo.png';
import SinglelineInput from '../secrets/SinglelineInput';
import './TerraformModal.css';
import StageUtils from '../../../utils/stageUtils';
import {
    Accordion,
    ApproveButton,
    CancelButton,
    Confirm,
    Form,
    GenericField,
    Header,
    Image,
    LoadingOverlay,
    Modal
} from '../../../components/basic';
import { useBoolean, useErrors, useInput, useResettableState } from '../../../utils/hooks';
import ID_REGEX from '../../../utils/consts';

const t = StageUtils.getT('widgets.blueprints.terraformModal');
const tError = StageUtils.composeT(t, 'errors');

const TerraformLogo = styled(Image)`
    &&& {
        width: 1.8em;
        margin-right: 0.25em;
    }
`;

export const inputMaxLength = 256;

export interface VariableRow extends Omit<Variable, 'name'> {
    name: { value: string; added?: boolean };
}

interface TerraformVariableValueInputProps extends CustomConfigurationComponentProps<string | undefined> {
    rowValues?: VariableRow;
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
    const secretSource = rowValues?.source === 'secret';
    const InputComponent = secretSource ? SinglelineInput : Form.Input;
    const externalValue = secretSource && !rowValues?.name.added;

    const handleChange: InputProps['onChange'] = (event, { value: valuePassed }) => {
        onChange?.(event, { name, value: valuePassed });
    };

    useEffect(() => {
        if (externalValue) onChange(undefined, { name, value: undefined });
    }, [externalValue]);

    return (
        <InputComponent
            disabled={rowValues?.duplicated || externalValue}
            name={name}
            fluid
            onChange={handleChange}
            maxLength={inputMaxLength}
            value={rowValues?.duplicated ? '' : value}
            {...rest}
        />
    );
}

const validationStrictRegExp = /^[a-zA-Z][a-zA-Z0-9._-]*$/;

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
    variables: VariableRow[],
    environment: VariableRow[],
    setVariables: (v: VariableRow[]) => void,
    setEnvironment: (v: VariableRow[]) => void
) {
    const existing: ExistingVariableNames = {
        input: [],
        secret: []
    };

    function markItemDuplicated(variable: VariableRow, existingArray: string[]) {
        if (existingArray.includes(variable.name.value)) {
            variable.duplicated = true;
        } else {
            variable.duplicated = false;
            existingArray.push(variable.name.value);
        }
    }

    function markDuplicatesForEachIterator(row: VariableRow, key: number, array: VariableRow[]) {
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

type ErrorSetter = (path: string, error: string) => void;

export default function TerraformModal({ onHide, toolbox }: { onHide: () => void; toolbox: Stage.Types.Toolbox }) {
    const variablesColumns = useMemo<Columns<VariableRow>>(
        () => [
            {
                id: 'variable',
                label: t('variablesTable.variable'),
                type: GenericField.STRING_TYPE,
                width: 3,
                maxLength: inputMaxLength
            },
            {
                id: 'source',
                label: t('variablesTable.source'),
                type: GenericField.LIST_TYPE,
                items: [
                    { name: t('variablesTable.sources.secret'), value: 'secret' },
                    { name: t('variablesTable.sources.input'), value: 'input' },
                    { name: t('variablesTable.sources.static'), value: 'static' }
                ],
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
                type: GenericField.STRING_TYPE,
                maxLength: inputMaxLength
            },
            {
                id: 'type',
                label: t('outputsTable.type'),
                type: GenericField.LIST_TYPE,
                items: [
                    { name: t('outputsTable.types.output'), value: 'output' },
                    { name: t('outputsTable.types.capability'), value: 'capability' }
                ],
                style: dynamicTableFieldStyle
            },
            {
                id: 'terraformOutput',
                label: t('outputsTable.terraformOutput'),
                default: '',
                type: GenericField.STRING_TYPE,
                maxLength: inputMaxLength
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

    const { setErrors, errors, getContextError } = useErrors();
    const [version, setVersion] = useInput(defaultVersion);
    const [blueprintName, setBlueprintName] = useInput('');
    const [blueprintDescription, setBlueprintDescription] = useInput('');

    const [templateUrl, setTemplateUrl] = useInput('');
    const [terraformTemplatePackage, setTerraformTemplatePackage] = useState<File>();
    const [terraformTemplatePackageBase64, setTerraformTemplatePackageBase64] = useState<string>();
    const [resourceLocation, setResourceLocation, clearResourceLocation] = useInput('');
    const [urlAuthentication, setUrlAuthentication] = useInput(false);
    const [credentials, setCredentials] = useInput(new Credentials());
    const [variables, setVariables] = useState<VariableRow[]>([]);
    const [environment, setEnvironment] = useState<VariableRow[]>([]);
    const [outputs, setOutputs] = useState<Output[]>([]);
    const [variablesDeferred, setVariablesDeferred] = useState<VariableRow[]>([]);
    const [outputsDeferred, setOutputsDeferred] = useState<Output[]>([]);

    const formHeaderErrors = useMemo(() => (errors ? [] : undefined), [errors]);

    const handleOnHideModal = useCallback(() => {
        clearErrors();
        onHide();
    }, [onHide, clearErrors]);

    const setFieldError: ErrorSetter = (path, error) => {
        setErrors(existingErrors => ({
            ...set(existingErrors, path, error)
        }));
    };

    function clearErrors() {
        setErrors(() => ({}));
    }

    function clearFieldError(fieldName: string) {
        setErrors(existingErrors => omit(existingErrors, fieldName));
    }

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
            const variablesTmp: VariableRow[] = entries(variablesResponse).map(([key, variableObj]: any) => ({
                variable: key,
                name: { value: variableObj.name },
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
                .doGetOutputsAndVariablesByURL(templateUrl, resourceLocation, credentials)
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
        setFormError: ErrorSetter
    ): void {
        const tNameError = Stage.Utils.composeT(tError, type);

        entities.forEach((variable, index) => {
            const path = `${type}[${index}].${IDkey}`;
            if (isEmpty(variable[IDkey])) {
                setFormError(path, tNameError('keyMissing'));
            } else if (!variable[IDkey].match(ID_REGEX)) {
                setFormError(path, tNameError('keyInvalid'));
            } else if (
                some(entities, (entity, entityIndex) => entityIndex !== index && entity[IDkey] === variable[IDkey])
            ) {
                setFormError(path, tNameError('keyDuplicated'));
            }
        });
    }

    function validateVariablesSource(variablesList: VariableRow[], variableType: string, setFormError: ErrorSetter) {
        variablesList.forEach((variable, index) => {
            const variableErrorPath = `${variableType}[${index}].source`;
            const hasError = get(errors, variableErrorPath);
            const tVariableError = Stage.Utils.composeT(tError, variableType);

            if (isEmpty(variable.source)) {
                setFormError(variableErrorPath, tVariableError('sourceMissing'));
            } else if (hasError) {
                clearFieldError(variableErrorPath);
            }
        });
    }

    function validateVariablesName(variablesList: VariableRow[], variableType: string, setFormError: ErrorSetter) {
        variablesList.forEach((variable, index) => {
            const variableErrorPath = `${variableType}[${index}].name`;
            const hasError = get(errors, variableErrorPath);
            const tVariableError = Stage.Utils.composeT(tError, variableType);

            if (isEmpty(variable.name)) {
                setFormError(variableErrorPath, tVariableError('nameMissing'));
            } else if (!variable.name.value.match(validationStrictRegExp)) {
                setFormError(variableErrorPath, tVariableError('nameInvalid'));
            } else if (hasError) {
                clearFieldError(variableErrorPath);
            }
        });
    }

    function validateVariables(variablesList: VariableRow[], variableType: string, setFormError = setFieldError) {
        validateIDs(variablesList, variableType, undefined, setFormError);
        validateVariablesSource(variablesList, variableType, setFormError);
        validateVariablesName(variablesList, variableType, setFormError);
    }

    function validateOutputsType(outputsList: Output[], setFormError: ErrorSetter) {
        outputsList.forEach((output, index) => {
            const outputErrorPath = `outputs[${index}].type`;
            const hasError = get(errors, outputErrorPath);
            const tOutputError = Stage.Utils.composeT(tError, 'outputs');

            if (isEmpty(output.type)) {
                setFormError(outputErrorPath, tOutputError('typeMissing'));
            } else if (hasError) {
                clearFieldError(outputErrorPath);
            }
        });
    }

    function validateOutputsTerraformOutput(outputsList: Output[], setFormError: ErrorSetter) {
        outputsList.forEach((output, index) => {
            const outputErrorPath = `outputs[${index}].terraformOutput`;
            const hasError = get(errors, outputErrorPath);
            const tOutputError = Stage.Utils.composeT(tError, 'outputs');

            if (isEmpty(output.terraformOutput)) {
                setFormError(outputErrorPath, tOutputError('outputMissing'));
            } else if (!output.terraformOutput.match(validationStrictRegExp)) {
                setFormError(outputErrorPath, tOutputError('outputInvalid'));
            } else if (hasError) {
                clearFieldError(outputErrorPath);
            }
        });
    }

    function validateOutputs(outputsList = outputs, setFormError = setFieldError) {
        validateIDs(outputs, 'outputs', 'name', setFormError);
        validateOutputsType(outputsList, setFormError);
        validateOutputsTerraformOutput(outputsList, setFormError);
    }

    async function handleSubmit() {
        clearErrors();

        let formHasErrors = false;

        const setFormError: ErrorSetter = (field, error) => {
            formHasErrors = true;
            setFieldError(field, error);
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
                if (!credentials.username) {
                    setFormError('username', tError('noUsername'));
                }
                if (!credentials.password) {
                    setFormError('password', tError('noPassword'));
                }
            }
        }

        function toVariables(variableRows: VariableRow[]) {
            return variableRows.map(row => ({ ...row, name: row.name.value }));
        }

        async function createSecretsFromVariables() {
            const secretActions = new SecretActions(toolbox.getManager());
            const { defaultVisibility } = Consts;
            const allSecretVariables: VariableRow[] = [...variables, ...environment].filter(
                variable => variable.source === 'secret'
            );

            await allSecretVariables
                .filter(secretVar => !secretVar.duplicated)
                .forEach(async secretVariable => {
                    // add secret if not exist
                    await secretActions.doGet(secretVariable.name.value).catch(async () => {
                        await secretActions.doCreate(
                            secretVariable.name.value,
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
                        variables: toVariables(variables),
                        environmentVariables: toVariables(environment),
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
                        variables: toVariables(variables),
                        environmentVariables: toVariables(environment),
                        outputs
                    })
                ]);
                blueprintContent.name = Consts.defaultBlueprintYamlFileName;
            }

            setProcessPhase('upload');

            if (urlAuthentication) {
                const secretActions = new SecretActions(toolbox.getManager());
                const { defaultVisibility } = Consts;
                await secretActions.doCreate(
                    `${blueprintName}.username`,
                    credentials.username,
                    defaultVisibility,
                    false
                );
                await secretActions.doCreate(
                    `${blueprintName}.password`,
                    credentials.password,
                    defaultVisibility,
                    false
                );
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
        const authenticationDataIncomplete = urlAuthentication && credentials.areIncomplete();
        if (!Stage.Utils.Url.isUrl(templateUrl) || authenticationDataIncomplete) {
            return;
        }

        setTemplateModulesLoading();
        new TerraformActions(toolbox)
            .doGetTemplateModulesByUrl(templateUrl, credentials)
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

    function handleVariablesChange(modifiedVariables: VariableRow[]) {
        return markDuplicates([...modifiedVariables], [...environment], setVariables, setEnvironment);
    }

    function handleEnvironmentChange(modifiedEnvironment: VariableRow[]) {
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
                        error={getContextError('blueprintName')}
                    >
                        <input maxLength={inputMaxLength} />
                    </Form.Input>
                    <Form.TextArea
                        label={t(`blueprintDescription`)}
                        name="blueprintDescription"
                        value={blueprintDescription}
                        onChange={setBlueprintDescription}
                        rows={4}
                        error={getContextError('blueprintDescription')}
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
                            <Form.Field label={t(`template`)} required error={getContextError('template')}>
                                <Form.UrlOrFile
                                    name="terraformUrlOrFile"
                                    placeholder={t(`template`)}
                                    onChangeUrl={setTemplateUrl}
                                    onBlurUrl={handleTemplateUrlBlur}
                                    onChangeFile={onTerraformTemplatePackageChange}
                                />
                            </Form.Field>
                            <OptionalCredentialsInput
                                onBlur={handleTemplateUrlBlur}
                                enabled={urlAuthentication}
                                onEnabledChange={setUrlAuthentication}
                                onCredentialsChange={setCredentials}
                                errorsProvider={getContextError}
                            />
                            <Form.Field label={t(`resourceLocation`)} required error={getContextError('resource')}>
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
                            errors={errors}
                        />
                        <TerraformModalTableAccordion
                            title={t('environment')}
                            value={environment}
                            idPrefix="environmentVariables"
                            onChange={handleEnvironmentChange}
                            columns={variablesColumns}
                            toolbox={toolbox}
                            errors={errors}
                        />
                        <TerraformModalTableAccordion
                            title={t('outputs')}
                            value={outputs}
                            idPrefix="outputs"
                            onChange={setOutputs}
                            columns={outputsColumns}
                            toolbox={toolbox}
                            errors={errors}
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
