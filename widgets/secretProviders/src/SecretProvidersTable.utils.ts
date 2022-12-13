const translationSecretProvider = Stage.Utils.getT('widgets.secretProviders');

export const translateSecretProviders = (key: string, params?: Record<string, any>) => {
    return translationSecretProvider(key, params);
};
