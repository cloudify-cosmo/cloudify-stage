import i18n from 'i18next';
import { useMemo } from 'react';

import { useInternalFetch, useManagerFetch } from '../common/fetchHooks';

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
    const pluginsCatalogUrl = i18n.t('urls.pluginsCatalog');
    // params from memo to prevent fetching on rendering
    const pluginsCatalogParams = useMemo(() => ({ url: pluginsCatalogUrl }), [pluginsCatalogUrl]);
    const catalogPlugins = useInternalFetch<CatalogPluginResponse[]>('/external/content', pluginsCatalogParams);
    const managerPlugins = useManagerFetch<ManagerPluginsResponse>(
        '/plugins?_include=distribution,package_name,package_version,visibility'
    );
    return useMemo<PluginsHook>(() => {
        const hook: PluginsHook = {
            loading: catalogPlugins.loading || managerPlugins.loading
        };
        if (catalogPlugins.response && managerPlugins.response) {
            hook.plugins = {
                available: catalogPlugins.response,
                installed: managerPlugins.response.items
            };
        }
        if (catalogPlugins.error || managerPlugins.error) {
            hook.error = i18n.t(
                'gettingStartedModal.initialization.pluginsLoadingError',
                'Plugins information loading error.'
            );
        }
        return hook;
    }, [catalogPlugins, managerPlugins]);
};

export default useFetchPlugins;
