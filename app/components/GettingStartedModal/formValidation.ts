import StageUtils from '../../utils/stageUtils';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData, GettingStartedTechnologiesData } from './model';

const t = StageUtils.getT('gettingStartedModal.validation');

export const validateTechnologyFields = (data: GettingStartedTechnologiesData) => {
    if (!_.some(data)) {
        return t('someTechnologyRequiredError');
    }
    return null;
};

export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    if (_.some(schema, ({ name }) => !data[name])) {
        return t('allSecretsRequiredError');
    }
    return null;
};
