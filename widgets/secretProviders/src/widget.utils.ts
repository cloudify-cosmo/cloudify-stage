import Consts from '../../../app/utils/consts';

export const translateSecretProviders = Stage.Utils.getT('widgets.secretProviders');
export const translateForm = Stage.Utils.composeT(translateSecretProviders, 'form');
interface Form {
    providerName?: string;
    hostname: string;
    authorizationToken: string;
}

export const validateModalForm = (form: Form, isCreateModal: boolean) => {
    const newErrors: Record<string, string> = {};
    if (isCreateModal) {
        if (!form.providerName) {
            newErrors.providerName = translateSecretProviders('form.errors.providerName.required');
        } else if (!Consts.ID_REGEX.test(form.providerName)) {
            newErrors.providerName = translateSecretProviders('form.errors.providerName.invalid');
        }
    }
    if (!form.hostname) {
        newErrors.hostname = translateSecretProviders('form.errors.hostname');
    }
    if (!form.authorizationToken) {
        newErrors.authorizationToken = translateSecretProviders('form.errors.authorizationToken');
    }
    return newErrors;
};
