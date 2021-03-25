import i18n from 'i18next';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData, GettingStartedTechnologiesData } from './model';

export const validateTechnologyFields = (data: GettingStartedTechnologiesData) => {
    if (!_.some(data)) {
        return i18n.t(
            'gettingStartedModal.modal.someTechnologyRequiredError',
            'At least one technology needs to be selected.'
        );
    }
    return null;
};

export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    if (_.some(schema, ({ name }) => !data[name])) {
        return i18n.t('gettingStartedModal.modal.allSecretsRequiredError', 'All secret values need to be specified.');
    }
    return null;
};
