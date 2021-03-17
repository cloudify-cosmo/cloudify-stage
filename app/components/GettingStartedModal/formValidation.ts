import i18n from 'i18next';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData, GettingStartedTechnologiesData } from './model';

export const validateTechnologyFields = (data: GettingStartedTechnologiesData) => {
    const errors: string[] = [];
    if (!_.some(data, item => item === true)) {
        errors.push(i18n.t('gettingStartedModal.modal.someTechnologyRequiredError', 'Please select some technology.'));
    }
    return errors;
};

export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    const errors: string[] = [];
    if (_.some(schema, item => !data[item.name])) {
        errors.push(i18n.t('gettingStartedModal.modal.allSecretsRequiredError', 'Please type all secrets.'));
    }
    return errors;
};
