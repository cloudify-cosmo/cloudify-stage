import i18n from 'i18next';
import { useState, useEffect } from 'react';
import { useManager } from '../managerHooks';

import type { SecretsResponse, SecretResponse } from './model';

export type SecretsHook = {
    loading: boolean;
    secrets?: SecretResponse[];
    error?: string;
};

const useFetchSecrets = () => {
    const manager = useManager();
    const [state, setState] = useState<SecretsHook>(() => ({ loading: true }));
    useEffect(() => {
        let mounted = true;
        manager
            .doGet('/secrets?_include=key,visibility')
            .then((secrets: SecretsResponse) => {
                if (mounted) {
                    setState({ loading: false, secrets: secrets.items });
                }
            })
            .catch(() => {
                if (mounted) {
                    setState({
                        loading: false,
                        error: i18n.t(
                            'gettingStartedModal.initialization.secretsLoadingError',
                            'Secrets information loading error.'
                        )
                    });
                }
            });
        return () => {
            mounted = false;
        };
    }, []);
    return state;
};

export default useFetchSecrets;
