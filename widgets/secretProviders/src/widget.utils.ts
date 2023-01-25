import Consts from '../../../app/utils/consts';

export const translateSecretProviders = Stage.Utils.getT('widgets.secretProviders');
export const translateForm = Stage.Utils.composeT(translateSecretProviders, 'form');
interface Form {
    providerName?: string;
    url: string;
    authorizationToken: string;
}

export const validateModalForm = (form: Form, isCreateModal: boolean) => {
    const errors: Record<string, string> = {};
    if (isCreateModal) {
        const validProviderName = Consts.ID_REGEX.test(form.providerName || '');
        if (!form.providerName) {
            errors.providerName = translateSecretProviders('form.errors.providerName.required');
        } else if (!validProviderName) {
            errors.providerName = translateSecretProviders('form.errors.providerName.invalid');
        }
    }
    if (!form.url) {
        errors.url = translateSecretProviders('form.errors.url');
    }
    if (!form.authorizationToken) {
        errors.authorizationToken = translateSecretProviders('form.errors.authorizationToken');
    }
    return errors;
};
