import i18n from 'i18next';
import { useState, useEffect } from 'react';

import { useInternal, useManager } from '../managerHooks';

import type { CatalogPluginResponse, ManagerPluginResponse, ManagerPluginsResponse } from './model';

export type PluginsHook = {
    loading: boolean;
    plugins?: {
        available: CatalogPluginResponse[];
        installed: ManagerPluginResponse[];
    };
    error?: string;
};

const useFetchPlugins = () => {
    const manager = useManager();
    const internal = useInternal();
    const [state, setState] = useState<PluginsHook>({ loading: true });
    useEffect(() => {
        let mounted = true;
        Promise.all([
            internal.doGet('/external/content', { url: i18n.t('urls.pluginsCatalog') }) as Promise<
                CatalogPluginResponse[]
            >,
            manager.doGet('/plugins?_include=distribution,package_name,package_version,visibility') as Promise<
                ManagerPluginsResponse
            >
        ])
            .then(([available, installed]) => {
                if (mounted) {
                    setState({
                        loading: false,
                        plugins: {
                            available,
                            installed: installed.items
                        }
                    });
                }
            })
            .catch(() => {
                if (mounted) {
                    setState({
                        loading: false,
                        error: i18n.t(
                            'gettingStartedModal.initialization.pluginsLoadingError',
                            'Plugins information loading error.'
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

export default useFetchPlugins;
