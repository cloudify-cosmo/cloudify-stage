import i18n from 'i18next';
import { useMemo } from 'react';

import type { FetchHook } from '../common/fetchHooks';
import { useManagerFetch } from '../common/fetchHooks';

import type { SecretsResponse, SecretResponse } from './model';

export type SecretsHook = FetchHook<SecretResponse[]>;

const useFetchSecrets = () => {
    const managerSecrets = useManagerFetch<SecretsResponse>('/secrets?_include=key,visibility');
    return useMemo(() => {
        return {
            loading: managerSecrets.loading,
            response: managerSecrets.response?.items,
            error: managerSecrets.error ? i18n.t('gettingStartedModal.initialization.secretsLoadingError') : undefined
        } as SecretsHook;
    }, [managerSecrets]);
};

export default useFetchSecrets;
