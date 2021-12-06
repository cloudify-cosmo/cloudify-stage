import StageUtils from '../../utils/stageUtils';

import type { GettingStartedSchemaSecret, GettingStartedSecretsData } from './model';

const t = StageUtils.getT('gettingStartedModal.validation');

// eslint-disable-next-line import/prefer-default-export
export const validateSecretFields = (schema: GettingStartedSchemaSecret[], data: GettingStartedSecretsData) => {
    if (_.some(schema, ({ name }) => !data[name])) {
        return t('allSecretsRequiredError');
    }
    return null;
};
