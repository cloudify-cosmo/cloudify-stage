import { useMemo } from 'react';
import { JSONData, JSONSchema, SecretData } from './model';
import { AvailablePluginData, InstalledPluginData, URLString } from './plugins/model';
import useFetchPlugins, { PluginsHook } from './plugins/useFetchPlugins';
import useFetchSecrets, { SecretsHook } from './secrets/useFetchSecrets';
import useCurrentDistribution from './useCurrentDistribution';

export const mapAvailablePlugins = (availablePlugins: AvailablePluginData[]) => {
    return availablePlugins.reduce((result, { name, ...other }) => {
        result[name] = other;
        return result;
    }, {} as Record<string, Omit<AvailablePluginData, 'name'>>);
};

export const mapInstalledPlugins = (catalogPlugins: InstalledPluginData[]) => {
    return catalogPlugins.reduce((result, { package_name, ...other }) => {
        result[package_name] = other;
        return result;
    }, {} as Record<string, Omit<InstalledPluginData, 'package_name'>>);
};

export const mapDefinedSecrets = (definedSecrets: SecretData[]) => {
    return definedSecrets.reduce((result, { key, ...other }) => {
        if (key) {
            result[key] = other;
        }
        return result;
    }, {} as Record<string, Omit<SecretData, 'name'>>);
};

export const filterSchemaData = (selectedPlugins: JSONSchema, typedSecrets: JSONData) => {
    const filteredSecrets = {} as JSONData;
    selectedPlugins.forEach(selectedPlugin => {
        filteredSecrets[selectedPlugin.name] = typedSecrets[selectedPlugin.name];
    });
    return filteredSecrets;
};

export type PluginInstallationTask = {
    icon?: URLString;
    name: string;
    version: string;
    distribution?: string;
    yamlUrl?: URLString;
    wagonUrl?: URLString;
};

export const createPluginInstallationTasks = (
    currentDistribution: string,
    currentPlugins: PluginsHook,
    selectedPlugins: JSONSchema
) => {
    const rejectedPlugins: PluginInstallationTask[] = [];
    const installedPlugins: PluginInstallationTask[] = [];
    const scheduledPlugins: PluginInstallationTask[] = [];
    if (currentPlugins && currentPlugins.plugins) {
        const catalogPlugins = mapAvailablePlugins(currentPlugins.plugins?.available ?? []);
        const managerPlugins = mapInstalledPlugins(currentPlugins.plugins?.installed ?? []);
        selectedPlugins.forEach(selectedPlugin => {
            selectedPlugin.plugins.forEach(pluginName => {
                const availablePlugin = catalogPlugins[pluginName];
                const installedPlugin = managerPlugins[pluginName];
                if (installedPlugin) {
                    installedPlugins.push({
                        icon: availablePlugin?.icon,
                        name: pluginName,
                        version: installedPlugin.package_version
                    });
                } else {
                    if (availablePlugin) {
                        const matchedWagon = availablePlugin.wagons.find(wagon => {
                            const wagonName = wagon.name.toLowerCase();
                            return wagonName === currentDistribution || wagonName === 'any';
                        });
                        if (matchedWagon) {
                            scheduledPlugins.push({
                                icon: availablePlugin.icon,
                                name: pluginName,
                                version: availablePlugin.version,
                                distribution: matchedWagon.name,
                                yamlUrl: availablePlugin.link,
                                wagonUrl: matchedWagon.url
                            });
                            return;
                        }
                    }
                    installedPlugins.push({
                        icon: availablePlugin?.icon,
                        name: pluginName,
                        version: availablePlugin.version
                    });
                }
            });
        });
    }
    return {
        rejectedPlugins,
        installedPlugins,
        scheduledPlugins
    };
};

export type SecretInstallationTask = {
    name: string;
    value: string;
};

export const createSecretsInstallationTasks = (
    currentSecrets: SecretsHook,
    selectedPlugins: JSONSchema,
    typedSecrets: JSONData
) => {
    const updatedSecrets: SecretInstallationTask[] = [];
    const createdSecrets: SecretInstallationTask[] = [];
    if (currentSecrets && currentSecrets.secrets) {
        const mappedSecrets = mapDefinedSecrets(currentSecrets.secrets ?? []);
        selectedPlugins.forEach(pluginsItem => {
            pluginsItem.secrets.forEach(secretsItem => {
                const pluginSecrets = typedSecrets[pluginsItem.name];
                if (pluginSecrets == null) {
                    return;
                }
                if (secretsItem.name in mappedSecrets) {
                    updatedSecrets.push({
                        name: secretsItem.name,
                        value: pluginSecrets[secretsItem.name] ?? ''
                    });
                } else {
                    createdSecrets.push({
                        name: secretsItem.name,
                        value: pluginSecrets[secretsItem.name] ?? ''
                    });
                }
            });
        });
    }
    return {
        updatedSecrets,
        createdSecrets
    };
};

export const usePluginInstallationTasks = (selectedPlugins: JSONSchema) => {
    const currentDistribution = useCurrentDistribution();
    const currentPlugins = useFetchPlugins();
    return useMemo(() => {
        if (currentPlugins.loading) {
            return { loading: currentPlugins.loading };
        }
        if (currentPlugins.error) {
            return { error: currentPlugins.error };
        }
        return {
            loading: false,
            tasks: createPluginInstallationTasks(currentDistribution, currentPlugins, selectedPlugins)
        };
    }, [currentDistribution, currentPlugins, selectedPlugins]);
};

export const useSecretsInstallationTasks = (selectedPlugins: JSONSchema, typedSecrets: JSONData) => {
    const currentSecrets = useFetchSecrets();
    const filteredTypedSecrets = useMemo(() => filterSchemaData(selectedPlugins, typedSecrets), [
        selectedPlugins,
        typedSecrets
    ]);
    return useMemo(() => {
        if (currentSecrets.loading) {
            return { loading: currentSecrets.loading };
        }
        if (currentSecrets.error) {
            return { error: currentSecrets.error };
        }
        return {
            loading: false,
            tasks: createSecretsInstallationTasks(currentSecrets, selectedPlugins, filteredTypedSecrets)
        };
    }, [currentSecrets, selectedPlugins, filteredTypedSecrets]);
};
