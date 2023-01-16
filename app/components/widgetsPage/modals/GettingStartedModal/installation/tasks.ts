import { useMemo } from 'react';
import log from 'loglevel';

import useFetchPlugins from '../plugins/useFetchPlugins';
import useFetchSecrets from '../secrets/useFetchSecrets';
import { useCurrentDistribution } from '../common/managerHooks';

import type { GettingStartedData, RegExpString, GettingStartedSecretsData, GettingStartedSchemaItem } from '../model';
import type { CatalogPluginResponse, ManagerPluginResponse, URLString } from '../plugins/model';
import type { PluginsHook } from '../plugins/useFetchPlugins';
import type { SecretsHook } from '../secrets/useFetchSecrets';
import type { BlueprintsHook } from '../blueprints/useFetchBlueprints';
import useFetchBlueprints from '../blueprints/useFetchBlueprints';
import type { BlueprintResponse } from '../blueprints/model';
import { getWagon, getYamlUrl } from '../../../../../utils/shared/PluginUtils';

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
        log.error(`Incorrect version expression: ${versionPattern}`, e);
        return false;
    }
};

export const mapCurrentBlueprints = (currentBlueprints: BlueprintResponse[]) => {
    return currentBlueprints.reduce((result, { id, ...other }) => {
        if (id) {
            result[id] = other;
        }
        return result;
    }, {} as Record<string, Omit<BlueprintResponse, 'id'>>);
};

export const mapDefinedSecrets = (definedSecrets: GettingStartedSecretsData[]) => {
    return definedSecrets.reduce((result, { key, ...other }) => {
        if (key) {
            result[key] = other;
        }
        return result;
    }, {} as Record<string, Omit<GettingStartedSecretsData, 'name'>>);
};

export const filterSchemaData = (
    selectedEnvironments: GettingStartedSchemaItem[],
    typedSecrets: GettingStartedData
) => {
    const filteredSecrets = {} as GettingStartedData;
    selectedEnvironments.forEach(selectedEnvironment => {
        filteredSecrets[selectedEnvironment.name] = typedSecrets[selectedEnvironment.name];
    });
    return filteredSecrets;
};

const findScheduledPluginCandidate = (
    catalogPlugins: CatalogPluginResponse[],
    currentDistribution: string,
    expectedPluginName: string,
    expectedPluginVersion?: RegExpString
): PluginInstallationTask | null => {
    const catalogPlugin = _.find(
        catalogPlugins,
        plugin => plugin.name === expectedPluginName && validatePluginVersion(expectedPluginVersion, plugin.version)
    );
    if (!catalogPlugin) {
        return null;
    }
    const wagon = getWagon(catalogPlugin, currentDistribution);
    if (!wagon) {
        return null;
    }
    return {
        icon: catalogPlugin.logo_url,
        name: expectedPluginName,
        title: catalogPlugin.display_name ?? expectedPluginName,
        version: catalogPlugin.version,
        distribution: wagon.release,
        yamlUrl: getYamlUrl(catalogPlugin),
        wagonUrl: wagon.url
    };
};

const findInstalledPluginCandidate = (
    managerPlugins: ManagerPluginResponse[],
    scheduledPluginCandidate: PluginInstallationTask | undefined | null,
    expectedPluginName: string,
    expectedPluginVersion?: RegExpString
) => {
    const managerPlugin = _.find(
        managerPlugins,
        plugin =>
            plugin.package_name === expectedPluginName &&
            validatePluginVersion(expectedPluginVersion, plugin.package_version)
    );
    if (!managerPlugin) {
        return null;
    }
    return {
        icon: scheduledPluginCandidate?.icon,
        name: expectedPluginName,
        title: scheduledPluginCandidate?.title ?? expectedPluginName,
        version: managerPlugin.package_version
    };
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
    selectedEnvironments: GettingStartedSchemaItem[]
) => {
    const acceptedPlugins = new Set();
    const rejectedPlugins: PluginInstallationTask[] = [];
    const installedPlugins: PluginInstallationTask[] = [];
    const scheduledPlugins: PluginInstallationTask[] = [];
    if (currentPlugins.response) {
        const catalogPlugins = currentPlugins.response?.available ?? [];
        const managerPlugins = currentPlugins.response?.installed ?? [];
        selectedEnvironments.forEach(selectedEnvironment => {
            selectedEnvironment.plugins.forEach(pluginDetails => {
                const expectedPluginName = pluginDetails.name;
                const expectedPluginVersion = pluginDetails.version;
                const expectedPluginKey = `${expectedPluginName} ${expectedPluginVersion}`;
                // to prevent duplicated items (accepted means: in installedPlugins or scheduledPlugins)
                if (acceptedPlugins.has(expectedPluginKey)) {
                    return;
                }
                const scheduledPluginCandidate = findScheduledPluginCandidate(
                    catalogPlugins,
                    currentDistribution,
                    expectedPluginName,
                    expectedPluginVersion
                );
                const installedPluginCandidate = findInstalledPluginCandidate(
                    managerPlugins,
                    scheduledPluginCandidate,
                    expectedPluginName,
                    expectedPluginVersion
                );
                if (installedPluginCandidate) {
                    acceptedPlugins.add(expectedPluginKey);
                    installedPlugins.push(installedPluginCandidate);
                } else if (scheduledPluginCandidate) {
                    acceptedPlugins.add(expectedPluginKey);
                    scheduledPlugins.push(scheduledPluginCandidate);
                } else {
                    rejectedPlugins.push({
                        name: expectedPluginName,
                        title: expectedPluginName,
                        version: String(expectedPluginVersion)
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
    selectedEnvironments: GettingStartedSchemaItem[],
    typedSecrets: GettingStartedData
) => {
    const usedSecrets = new Set();
    const updatedSecrets: SecretInstallationTask[] = [];
    const createdSecrets: SecretInstallationTask[] = [];
    if (currentSecrets.response) {
        const mappedSecrets = mapDefinedSecrets(currentSecrets.response ?? []);
        selectedEnvironments.forEach(selectedEnvironment => {
            selectedEnvironment.secrets.forEach(secretsItem => {
                if (usedSecrets.has(secretsItem.name)) {
                    return;
                }
                usedSecrets.add(secretsItem.name);
                const pluginSecrets = typedSecrets[selectedEnvironment.name];
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
    blueprintZipUrl: string;
    blueprintYamlFile: string;
};

export const createBlueprintsInstallationTasks = (
    currentBlueprints: BlueprintsHook,
    selectedEnvironments: GettingStartedSchemaItem[]
) => {
    const usedBlueprints = new Set();
    const uploadedBlueprints: BlueprintInstallationTask[] = [];
    const scheduledBlueprints: BlueprintInstallationTask[] = [];
    if (currentBlueprints.response) {
        const mappedBlueprints = mapCurrentBlueprints(currentBlueprints.response);
        selectedEnvironments.forEach(selectedEnvironment => {
            selectedEnvironment.blueprints.forEach(blueprintItem => {
                if (usedBlueprints.has(blueprintItem.id)) {
                    return;
                }
                usedBlueprints.add(blueprintItem.id);
                const blueprintTask = {
                    blueprintName: blueprintItem.name,
                    blueprintZipUrl: blueprintItem.zipUrl,
                    blueprintYamlFile: blueprintItem.yamlFile ?? ''
                };
                if (blueprintItem.name in mappedBlueprints) {
                    uploadedBlueprints.push(blueprintTask);
                } else {
                    scheduledBlueprints.push(blueprintTask);
                }
            });
        });
    }
    return { uploadedBlueprints, scheduledBlueprints };
};

export const usePluginsInstallationTasks = (selectedEnvironments: GettingStartedSchemaItem[]) => {
    const currentDistribution = useCurrentDistribution();
    const currentPlugins = useFetchPlugins();
    return useMemo(() => {
        if (currentPlugins.loading) {
            return { loading: true as const };
        }
        if (currentPlugins.error) {
            return { loading: false as const, error: currentPlugins.error as string };
        }
        return {
            loading: false as const,
            tasks: createPluginInstallationTasks(currentDistribution, currentPlugins, selectedEnvironments)
        };
    }, [currentDistribution, currentPlugins, selectedEnvironments]);
};

export const useSecretsInstallationTasks = (
    selectedEnvironments: GettingStartedSchemaItem[],
    typedSecrets: GettingStartedData
) => {
    const currentSecrets = useFetchSecrets();
    const filteredTypedSecrets = useMemo(
        () => filterSchemaData(selectedEnvironments, typedSecrets),
        [selectedEnvironments, typedSecrets]
    );
    return useMemo(() => {
        if (currentSecrets.loading) {
            return { loading: true as const };
        }
        if (currentSecrets.error) {
            return { loading: false as const, error: currentSecrets.error as string };
        }
        return {
            loading: false,
            tasks: createSecretsInstallationTasks(currentSecrets, selectedEnvironments, filteredTypedSecrets)
        };
    }, [currentSecrets, selectedEnvironments, filteredTypedSecrets]);
};

export const useBlueprintsInstallationTasks = (selectedEnvironments: GettingStartedSchemaItem[]) => {
    const currentBlueprints = useFetchBlueprints();
    return useMemo(() => {
        if (currentBlueprints.loading) {
            return { loading: true };
        }
        if (currentBlueprints.error) {
            return { loading: false, error: currentBlueprints.error };
        }
        return {
            loading: false,
            tasks: createBlueprintsInstallationTasks(currentBlueprints, selectedEnvironments),
            error: undefined
        };
    }, [currentBlueprints, selectedEnvironments]);
};
