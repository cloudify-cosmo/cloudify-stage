export const translateSecrets = Stage.Utils.getT('widgets.secrets');
export const translateForm = Stage.Utils.getT('widgets.secrets.form');

export const getSecretProviderOptions = (useSecretProvider: boolean, secretProviderPath: string) => {
    return useSecretProvider ? { path: secretProviderPath } : undefined;
};
