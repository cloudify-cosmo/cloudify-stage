import i18n from 'i18next';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData, GettingStartedTechnologiesData } from './model';

export const validateTechnologyFields = (data: GettingStartedTechnologiesData) => {
    if (!_.some(data, item => item === true)) {
        return i18n.t('gettingStartedModal.modal.someTechnologyRequiredError', 'Please select some technology.');
    }
    return null;
};

export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    if (_.some(schema, item => !data[item.name])) {
        return i18n.t('gettingStartedModal.modal.allSecretsRequiredError', 'Please type all secrets.');
    }
    return null;
};
