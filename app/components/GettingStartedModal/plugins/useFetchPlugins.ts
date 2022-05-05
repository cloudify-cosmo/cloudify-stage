import i18n from 'i18next';
import { useMemo } from 'react';

import type { FetchHook } from '../common/fetchHooks';
import { useInternalFetch, useManagerFetch } from '../common/fetchHooks';

import type { CatalogPluginResponse, ManagerPluginResponse, ManagerPluginsResponse } from './model';

export type PluginsHook = FetchHook<{
    available: CatalogPluginResponse[];
    installed: ManagerPluginResponse[];
}>;

const useFetchPlugins = () => {
    const pluginsCatalogUrl = i18n.t('urls.pluginsCatalog');
    // params for internal hook moved inside memo to prevent each time fetching on rendering
    const pluginsCatalogParams = useMemo(() => ({ url: pluginsCatalogUrl }), [pluginsCatalogUrl]);
    const catalogPlugins = useInternalFetch<CatalogPluginResponse[]>('/external/content', pluginsCatalogParams);
    const managerPlugins = useManagerFetch<ManagerPluginsResponse>(
        '/plugins?_include=distribution,package_name,package_version,visibility'
    );
    return useMemo(() => {
        const hook: PluginsHook = {
            loading: catalogPlugins.loading || managerPlugins.loading
        };
        if (catalogPlugins.response && managerPlugins.response) {
            hook.response = {
                available: catalogPlugins.response,
                installed: managerPlugins.response.items
            };
        }
        if (catalogPlugins.error || managerPlugins.error) {
            hook.error = i18n.t('gettingStartedModal.initialization.pluginsMetadataLoadingError');
        }
        return hook;
    }, [catalogPlugins, managerPlugins]);
};

export default useFetchPlugins;
