import { useState, useEffect } from 'react';
import { useManager } from '../managerHooks';
import type { SecretsData } from './model';

type SecretsHook = {
    loading: boolean;
    secrets?: SecretsData;
    error?: string;
};

const useFetchSecrets = () => {
    const manager = useManager();
    const [state, setState] = useState<SecretsHook>(() => ({ loading: true }));
    useEffect(() => {
        let mounted = true;
        manager
            .doGet('/secrets?_include=key,visibility')
            .then((secrets: any) => {
                if (mounted) {
                    setState({ loading: false, secrets });
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
