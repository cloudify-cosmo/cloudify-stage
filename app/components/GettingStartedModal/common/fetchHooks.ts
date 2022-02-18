import { useEffect, useState } from 'react';

import Internal from '../../../utils/Internal';
import Manager from '../../../utils/Manager';
import { useInternal } from './managerHooks';
import useManager from '../../../utils/hooks/useManager';

export type FetchHook<T> = {
    loading: boolean;
    response?: T;
    error?: string;
};

export const useFetch = <T extends unknown>(fetcher: Manager | Internal, url: string, params?: any) => {
    const [state, setState] = useState<FetchHook<T>>({ loading: true });
    useEffect(() => {
        let mounted = true;
        fetcher
            .doGet(url, { params })
            .then(response => {
                if (mounted) {
                    setState({
                        loading: false,
                        response
                    });
                }
            })
            .catch(error => {
                if (mounted) {
                    setState({
                        loading: false,
                        error: error.message
                    });
                }
            });
        return () => {
            mounted = false;
        };
    }, [url, params]);
    return state;
};

export const useManagerFetch = <T extends unknown>(url: string, params?: any) => {
    const manager = useManager();
    return useFetch<T>(manager, url, params);
};

export const useInternalFetch = <T extends unknown>(url: string, params?: any) => {
    const internal = useInternal();
    return useFetch<T>(internal, url, params);
};
