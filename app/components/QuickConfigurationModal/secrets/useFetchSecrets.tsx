import { useState, useEffect } from 'react';
import { useManager } from '../managerHooks';
import type { SecretsData, SecretData } from './model';

export type SecretsHook = {
    loading: boolean;
    secrets?: SecretData[];
    error?: string;
};

const useFetchSecrets = () => {
    const manager = useManager();
    const [state, setState] = useState<SecretsHook>(() => ({ loading: true }));
    useEffect(() => {
        let mounted = true;
        manager
            .doGet('/secrets?_include=key,visibility')
            .then((secrets: SecretsData) => {
                if (mounted) {
                    setState({ loading: false, secrets: secrets.items });
                }
            })
            .catch(() => {
                setState({
                    loading: false,
                    error: 'Secrets information loading error.'
                });
            });
        return () => {
            mounted = false;
        };
    }, []);
    return state;
};

export default useFetchSecrets;
