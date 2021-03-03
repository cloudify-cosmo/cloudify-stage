import { useState, useEffect } from 'react';
import { useInternal, useManager } from '../managerHooks';

type PluginsHook = {
    loading: boolean;
    plugins?: {
        available: AvailablePluginData[];
        installed: InstalledPluginsData;
    };
    error?: string;
};

const useFetchPlugins = () => {
    const manager = useManager();
    const internal = useInternal();
    const [state, setState] = useState<PluginsHook>(() => ({ loading: true }));
    useEffect(() => {
        let mounted = true;
        Promise.all([
            internal.doGet('/external/content', { url: Stage.i18n.t('widgets.common.urls.pluginsCatalog') }),
            manager.doGet('/plugins?_include=distribution,package_name,package_version,visibility')
        ])
            .then(([available, installed]) => {
                if (mounted) {
                    setState({
                        loading: false,
                        plugins: { available, installed }
                    });
                }
            })
            .catch(() => {
                setState({
                    loading: false,
                    error: 'Plugins information loading error.'
                });
            });
        return () => {
            mounted = false;
        };
    }, []);
    return state;
};

export default useFetchPlugins;
