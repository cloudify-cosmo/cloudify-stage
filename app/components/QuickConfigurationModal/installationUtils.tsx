import { useMemo } from 'react';
import { JSONData, JSONSchema, SecretData } from './model';
import { AvailablePluginData, InstalledPluginData } from './plugins/model';
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

export const createPluginInstallationTasks = (
    currentDistribution: string,
    currentPlugins: PluginsHook,
    selectedPlugins: JSONSchema
) => {
    const rejectedPlugins: string[] = [];
    const installedPlugins: string[] = [];
    const scheduledPlugins: string[] = [];
    if (currentPlugins && currentPlugins.plugins) {
        const catalogPlugins = mapAvailablePlugins(currentPlugins.plugins?.available ?? []);
        const managerPlugins = mapInstalledPlugins(currentPlugins.plugins?.installed ?? []);
        selectedPlugins.forEach(selectedPlugin => {
            selectedPlugin.plugins.forEach(pluginItem => {
                const installedPlugin = managerPlugins[pluginItem];
                if (installedPlugin) {
                    installedPlugins.push(pluginItem);
                } else {
                    const availablePlugin = catalogPlugins[pluginItem];
                    if (availablePlugin) {
                        const matchedWagon = availablePlugin.wagons.find(wagon => {
                            const wagonName = wagon.name.toLowerCase();
                            return wagonName === currentDistribution || wagonName === 'any';
                        });
                        if (matchedWagon) {
                            scheduledPlugins.push(pluginItem);
                            return;
                        }
                    }
                    rejectedPlugins.push(pluginItem);
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

export const createSecretsInstallationSummary = (
    currentSecrets: SecretsHook,
    selectedPlugins: JSONSchema,
    typedSecrets: JSONData
) => {
    const updatedSecrets: string[] = [];
    const createdSecrets: string[] = [];
    if (currentSecrets && currentSecrets.secrets) {
        const mappedSecrets = mapDefinedSecrets(currentSecrets.secrets ?? []);
        selectedPlugins.forEach(pluginsItem => {
            pluginsItem.secrets.forEach(secretsItem => {
                const typedSecret = typedSecrets[pluginsItem.name];
                if (secretsItem.name in mappedSecrets) {
                    updatedSecrets.push(secretsItem.name);
                } else {
                    createdSecrets.push(secretsItem.name);
                }
            });
        });
    }
    return {
        updatedSecrets,
        createdSecrets
    };
};

export const useCreatePluginInstallationTasks = (selectedPlugins: JSONSchema) => {
    const currentDistribution = useCurrentDistribution();
    const currentPlugins = useFetchPlugins();
    const pluginInstallationTasks = useMemo(
        () => createPluginInstallationTasks(currentDistribution, currentPlugins, selectedPlugins),
        [currentDistribution, currentPlugins, selectedPlugins]
    );
    return {
        loading: currentPlugins.loading,
        tasks: pluginInstallationTasks,
        error: currentPlugins.error
    };
};

export const useCreateSecretsInstallationSummary = (selectedPlugins: JSONSchema, typedSecrets: JSONData) => {
    const currentSecrets = useFetchSecrets();
    const filteredTypedSecrets = useMemo(() => filterSchemaData(selectedPlugins, typedSecrets), [
        selectedPlugins,
        typedSecrets
    ]);
    const secretInstallationTasks = useMemo(
        () => createSecretsInstallationSummary(currentSecrets, selectedPlugins, filteredTypedSecrets),
        [currentSecrets, selectedPlugins, filteredTypedSecrets]
    );
    return {
        loading: currentSecrets.loading,
        tasks: secretInstallationTasks,
        error: currentSecrets.error
    };
};
