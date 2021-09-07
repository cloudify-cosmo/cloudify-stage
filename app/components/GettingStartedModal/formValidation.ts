import StageUtils from '../../utils/stageUtils';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData, GettingStartedEnvironmentsData } from './model';

const t = StageUtils.getT('gettingStartedModal.validation');

export const validateEnvironmentsFields = (data: GettingStartedEnvironmentsData) => {
    if (!_.some(data)) {
        return t('environmentRequiredError');
    }
    return null;
};

export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    if (_.some(schema, ({ name }) => !data[name])) {
        return t('allSecretsRequiredError');
    }
    return null;
};
