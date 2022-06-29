import { some, isEmpty } from 'lodash';

import type { Variable, Output } from '../../../../../backend/routes/Terraform.types';

const validationStrictRegExp = /^[a-zA-Z][a-zA-Z0-9._-]*$/;

const validationRegExp = /^[a-zA-Z0-9._-]*$/;

const t = Stage.Utils.getT('widgets.blueprints.terraformModal');
const tError = Stage.Utils.composeT(t, 'errors');

export function validateBlueprintName(name: string, setFieldError: (fieldName: string, message?: string) => void) {
    if (!name) {
        setFieldError('blueprintName', tError('noBlueprintName'));
        return false;
    }
    if (!name.match(validationStrictRegExp)) {
        setFieldError('blueprintName', tError('invalidBlueprintName'));
        return false;
    }

    return true;
}

export function validateBlueprintDescription(
    desc: string,
    setFieldError: (fieldName: string, message?: string) => void
) {
    const descriptionValidationRegexp = /^[ -~\s]*$/;

    if (!desc.match(descriptionValidationRegexp)) {
        setFieldError('blueprintDescription', tError('invalidBlueprintDescription'));
        return false;
    }

    return true;
}

export function validateTemplate(
    terraformTemplatePackage: File | undefined,
    templateUrl: string,
    setFieldError: (fieldName: string, message?: string) => void
) {
    if (!terraformTemplatePackage) {
        if (!templateUrl) {
            setFieldError('template', tError('noTerraformTemplate'));
            return false;
        }
        if (!Stage.Utils.Url.isUrl(templateUrl)) {
            setFieldError('template', tError('invalidTerraformTemplate'));
            return false;
        }
    }

    return true;
}

export function validateResourceLocation(
    resourceLocation: string,
    setFieldError: (fieldName: string, message?: string) => void
) {
    if (!resourceLocation) {
        setFieldError('resource', tError('noResourceLocation'));
        return false;
    }

    return true;
}

export function validateUrlAuthentication(
    urlAuthentication: boolean,
    username: string,
    password: string,
    setFieldError: (fieldName: string, message?: string) => void
) {
    if (urlAuthentication) {
        if (!username) {
            setFieldError('username', tError('noUsername'));
            return false;
        }
        if (!password) {
            setFieldError('password', tError('noPassword'));
            return false;
        }
    }

    return true;
}

export function validateIDs(
    entities: Record<string, any>[],
    type: string,
    setFieldError: (fieldName: string, message?: string) => void,
    IDkey: 'variable' | 'name' = 'variable'
): boolean {
    let validity = true;
    entities.forEach((variable, index) => {
        if (!validateID(variable, index, entities, type, setFieldError, IDkey)) {
            validity = false;
        }
    });

    return validity;
}

export function validateID(
    variable: Record<string, any>,
    index: number,
    entities: Record<string, any>[],
    type: string,
    setFieldError: (fieldName: string, message?: string) => void,
    IDkey: 'variable' | 'name' = 'variable'
): boolean {
    const tNameError = Stage.Utils.composeT(tError, type);

    if (isEmpty(variable[IDkey])) {
        setFieldError(`${type}_${index}_${IDkey}`, tNameError('keyMissing'));
        return false;
    }
    if (!variable[IDkey].match(validationRegExp)) {
        setFieldError(`${type}_${index}_${IDkey}`, tNameError('keyInvalid'));
        return false;
    }
    if (some(entities, (entity, entityIndex) => entityIndex !== index && entity[IDkey] === variable[IDkey])) {
        setFieldError(`${type}_${index}_${IDkey}`, tNameError('keyDuplicated'));
        return false;
    }
    return true;
}

export function validateVariables(
    variablesList: Variable[],
    type: string,
    setFieldError: (fieldName: string, message?: string) => void
) {
    let validity = validateIDs(variablesList, type, setFieldError);

    const tVariableError = Stage.Utils.composeT(tError, type);

    variablesList.forEach((variable, index) => {
        if (isEmpty(variable.source)) {
            validity = false;
            setFieldError(`${type}_${index}_source`, tVariableError('sourceMissing'));
        } else if (variable.source !== 'static') {
            if (isEmpty(variable.name)) {
                validity = false;
                setFieldError(`${type}_${index}_name`, tVariableError('nameMissing'));
            } else if (!variable.name.match(validationStrictRegExp)) {
                validity = false;
                setFieldError(`${type}_${index}_name`, tVariableError('nameInvalid'));
            }
        }
    });

    return validity;
}

export function validateOutputs(outputs: Output[], setFieldError: (fieldName: string, message?: string) => void) {
    let validity = validateIDs(outputs, 'outputs', setFieldError, 'name');

    const tOutputError = Stage.Utils.composeT(tError, 'outputs');

    outputs.forEach((output: Output, index: number) => {
        if (isEmpty(output.type)) {
            validity = false;
            setFieldError(`outputs_${index}_type`, tOutputError('typeMissing'));
        }

        if (isEmpty(output.terraformOutput)) {
            validity = false;
            setFieldError(`outputs_${index}_terraformOutput`, tOutputError('outputMissing'));
        } else if (!output.terraformOutput.match(validationStrictRegExp)) {
            validity = false;
            setFieldError(`outputs_${index}_terraformOutput`, tOutputError('outputInvalid'));
        }
    });

    return validity;
}
