import i18n from 'i18next';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData, GettingStartedTechnologiesData } from './model';

export const validateTechnologyFields = (data: GettingStartedTechnologiesData) => {
    if (!_.some(data)) {
        return i18n.t('gettingStartedModal.validation.someTechnologyRequiredError');
    }
    return null;
};

export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    if (_.some(schema, ({ name }) => !data[name])) {
        return i18n.t('gettingStartedModal.validation.allSecretsRequiredError');
    }
    return null;
};
