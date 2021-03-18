import { useMemo } from 'react';

import useFetchPlugins from '../plugins/useFetchPlugins';
import useFetchSecrets from '../secrets/useFetchSecrets';
import { useCurrentDistribution } from '../managerHooks';

import type { GettingStartedData, GettingStartedSchema, RegExpString, GettingStartedSecretsData } from '../model';
import type { URLString } from '../plugins/model';
import type { PluginsHook } from '../plugins/useFetchPlugins';
import type { SecretsHook } from '../secrets/useFetchSecrets';

/**
 * Validates plugin version. If version pattern is not defined, any version is accepted.
 * @param versionPattern regular expression pattern that describes accepted version string
 * @param pluginVersion checked plugin version
 * @returns true means the version is accepted
 */
const validatePluginVersion = (versionPattern?: RegExpString, pluginVersion?: string | null) => {
    if (versionPattern == null) {
        return true;
    }
    if (pluginVersion == null) {
        return false;
    }
    try {
        // eslint-disable-next-line security/detect-non-literal-regexp
        const versionExpression = new RegExp(versionPattern);
        return versionExpression.test(pluginVersion);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Incorrect version expression: ${versionPattern}`, e);
        return false;
    }
};

export const mapDefinedSecrets = (definedSecrets: GettingStartedSecretsData[]) => {
    return definedSecrets.reduce((result, { key, ...other }) => {
        if (key) {
            result[key] = other;
        }
        return result;
    }, {} as Record<string, Omit<GettingStartedSecretsData, 'name'>>);
};

export const filterSchemaData = (selectedPlugins: GettingStartedSchema, typedSecrets: GettingStartedData) => {
    const filteredSecrets = {} as GettingStartedData;
    selectedPlugins.forEach(selectedPlugin => {
        filteredSecrets[selectedPlugin.name] = typedSecrets[selectedPlugin.name];
    });
    return filteredSecrets;
};

export type PluginInstallationTask = {
    icon?: URLString;
    name: string;
    title: string;
    version: string;
    distribution?: string;
    yamlUrl?: URLString;
    wagonUrl?: URLString;
};

export const createPluginInstallationTasks = (
    currentDistribution: string,
    currentPlugins: PluginsHook,
    selectedPlugins: GettingStartedSchema
) => {
    const acceptedPlugins: Record<string, boolean> = {};
    const rejectedPlugins: PluginInstallationTask[] = [];
    const installedPlugins: PluginInstallationTask[] = [];
    const scheduledPlugins: PluginInstallationTask[] = [];
    if (currentPlugins && currentPlugins.plugins) {
        const catalogPlugins = currentPlugins.plugins?.available ?? [];
        const managerPlugins = currentPlugins.plugins?.installed ?? [];
        selectedPlugins.forEach(selectedPlugin => {
            selectedPlugin.plugins.forEach(pluginDetails => {
                const expectedPluginName = pluginDetails.name;
                const expectedPluginVersion = pluginDetails.version;
                const expectedPluginKey = `${expectedPluginName} ${expectedPluginVersion}`;
                // to prevent duplicated items (accepted means: in installedPlugins or scheduledPlugins)
                if (expectedPluginKey in acceptedPlugins) {
                    return;
                }
                let scheduledPluginCandidate: PluginInstallationTask | null = null;
                for (let i = 0; i < catalogPlugins.length; i += 1) {
                    const catalogPlugin = catalogPlugins[i];
                    if (
                        catalogPlugin.name === expectedPluginName &&
                        validatePluginVersion(expectedPluginVersion, catalogPlugin.version)
                    ) {
                        const matchedWagon = catalogPlugin.wagons.find(wagon => {
                            const wagonName = wagon.name.toLowerCase();
                            return wagonName === currentDistribution || wagonName === 'any';
                        });
                        if (matchedWagon) {
                            scheduledPluginCandidate = {
                                icon: catalogPlugin.icon,
                                name: expectedPluginName,
                                title: catalogPlugin.title ?? expectedPluginName,
                                version: catalogPlugin.version,
                                distribution: matchedWagon.name,
                                yamlUrl: catalogPlugin.link,
                                wagonUrl: matchedWagon.url
                            };
                            break;
                        }
                    }
                }
                for (let i = 0; i < managerPlugins.length; i += 1) {
                    const managerPlugin = managerPlugins[i];
                    if (
                        managerPlugin.package_name === expectedPluginName &&
                        validatePluginVersion(expectedPluginVersion, managerPlugin.package_version)
                    ) {
                        acceptedPlugins[expectedPluginKey] = true;
                        installedPlugins.push({
                            icon: scheduledPluginCandidate?.icon,
                            name: expectedPluginName,
                            title: scheduledPluginCandidate?.title ?? expectedPluginName,
                            version: managerPlugin.package_version
                        });
                        return;
                    }
                }
                if (scheduledPluginCandidate) {
                    acceptedPlugins[expectedPluginKey] = true;
                    scheduledPlugins.push(scheduledPluginCandidate);
                } else {
                    rejectedPlugins.push({
                        name: expectedPluginName,
                        title: expectedPluginName,
                        version: 'unknown'
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
    selectedPlugins: GettingStartedSchema,
    typedSecrets: GettingStartedData
) => {
    const usedSecrets: Record<string, boolean> = {};
    const updatedSecrets: SecretInstallationTask[] = [];
    const createdSecrets: SecretInstallationTask[] = [];
    if (currentSecrets && currentSecrets.secrets) {
        const mappedSecrets = mapDefinedSecrets(currentSecrets.secrets ?? []);
        selectedPlugins.forEach(pluginsItem => {
            pluginsItem.secrets.forEach(secretsItem => {
                if (secretsItem.name in usedSecrets) {
                    return;
                }
                usedSecrets[secretsItem.name] = true;
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

export type BlueprintInstallationTask = {
    blueprintName: string;
    blueprintUrl: string;
    applicationName: string;
};

export const createBlueprintsInstallationTasks = () => {
    const scheduledBlueprints: BlueprintInstallationTask[] = [];
    //TODO: logics
    return scheduledBlueprints;
};

export const usePluginsInstallationTasks = (selectedPlugins: GettingStartedSchema) => {
    const currentDistribution = useCurrentDistribution();
    const currentPlugins = useFetchPlugins();
    return useMemo(() => {
        if (currentPlugins.loading) {
            return { loading: currentPlugins.loading };
        }
        if (currentPlugins.error) {
            return { loading: false, error: currentPlugins.error };
        }
        return {
            loading: false,
            tasks: createPluginInstallationTasks(currentDistribution, currentPlugins, selectedPlugins)
        };
    }, [currentDistribution, currentPlugins, selectedPlugins]);
};

export const useSecretsInstallationTasks = (
    selectedPlugins: GettingStartedSchema,
    typedSecrets: GettingStartedData
) => {
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
            return { loading: false, error: currentSecrets.error };
        }
        return {
            loading: false,
            tasks: createSecretsInstallationTasks(currentSecrets, selectedPlugins, filteredTypedSecrets)
        };
    }, [currentSecrets, selectedPlugins, filteredTypedSecrets]);
};

export const useBlueprintsInstallationTasks = () => {
    //TODO: 
    return createBlueprintsInstallationTasks();
};
