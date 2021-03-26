import i18n from 'i18next';
import { useMemo } from 'react';
import { useManagerFetch } from '../common/fetchHooks';

import type { SecretsResponse, SecretResponse } from './model';

export type SecretsHook = {
    loading: boolean;
    secrets?: SecretResponse[];
    error?: string;
};

const useFetchSecrets = () => {
    const managerSecrets = useManagerFetch<SecretsResponse>('/secrets?_include=key,visibility');
    return useMemo<SecretsHook>(() => {
        return {
            loading: managerSecrets.loading,
            secrets: managerSecrets.response?.items,
            error: managerSecrets.error
                ? i18n.t('gettingStartedModal.initialization.secretsLoadingError', 'Secrets information loading error.')
                : undefined
        };
    }, [managerSecrets]);
};

export default useFetchSecrets;
