import { useMemo } from 'react';
import log from 'loglevel';

import useFetchPlugins from '../plugins/useFetchPlugins';
import useFetchSecrets from '../secrets/useFetchSecrets';
import { useCurrentDistribution } from '../managerHooks';

import type { GettingStartedData, GettingStartedSchema, RegExpString, GettingStartedSecretsData } from '../model';
import type { CatalogPluginResponse, ManagerPluginResponse, URLString } from '../plugins/model';
import type { PluginsHook } from '../plugins/useFetchPlugins';
import type { SecretsHook } from '../secrets/useFetchSecrets';
import useFetchBlueprints, { BlueprintsHook } from '../blueprints/useFetchBlueprints';
import { BlueprintData } from '../blueprints/model';

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

export const mapCurrentBlueprints = (currentBlueprints: BlueprintData[]) => {
    return currentBlueprints.reduce((result, { id, ...other }) => {
        if (id) {
            result[id] = other;
        }
        return result;
    }, {} as Record<string, Omit<BlueprintData, 'id'>>);
};

export const mapDefinedSecrets = (definedSecrets: GettingStartedSecretsData[]) => {
    return definedSecrets.reduce((result, { key, ...other }) => {
        if (key) {
            result[key] = other;
        }
        return result;
    }, {} as Record<string, Omit<GettingStartedSecretsData, 'name'>>);
};

export const filterSchemaData = (selectedTechnologies: GettingStartedSchema, typedSecrets: GettingStartedData) => {
    const filteredSecrets = {} as GettingStartedData;
    selectedTechnologies.forEach(selectedTechnology => {
        filteredSecrets[selectedTechnology.name] = typedSecrets[selectedTechnology.name];
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
    const matchedWagon = _.find(catalogPlugin.wagons, wagon => {
        const wagonName = wagon.name.toLowerCase();
        return wagonName === currentDistribution || wagonName === 'any';
    });
    if (!matchedWagon) {
        return null;
    }
    return {
        icon: catalogPlugin.icon,
        name: expectedPluginName,
        title: catalogPlugin.title ?? expectedPluginName,
        version: catalogPlugin.version,
        distribution: matchedWagon.name,
        yamlUrl: catalogPlugin.link,
        wagonUrl: matchedWagon.url
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
    selectedTechnologies: GettingStartedSchema
) => {
    const acceptedPlugins = new Set();
    const rejectedPlugins: PluginInstallationTask[] = [];
    const installedPlugins: PluginInstallationTask[] = [];
    const scheduledPlugins: PluginInstallationTask[] = [];
    if (currentPlugins.response) {
        const catalogPlugins = currentPlugins.response?.available ?? [];
        const managerPlugins = currentPlugins.response?.installed ?? [];
        selectedTechnologies.forEach(selectedTechnology => {
            selectedTechnology.plugins.forEach(pluginDetails => {
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
    selectedTechnologies: GettingStartedSchema,
    typedSecrets: GettingStartedData
) => {
    const usedSecrets = new Set();
    const updatedSecrets: SecretInstallationTask[] = [];
    const createdSecrets: SecretInstallationTask[] = [];
    if (currentSecrets.response) {
        const mappedSecrets = mapDefinedSecrets(currentSecrets.response ?? []);
        selectedTechnologies.forEach(selectedTechnology => {
            selectedTechnology.secrets.forEach(secretsItem => {
                if (usedSecrets.has(secretsItem.name)) {
                    return;
                }
                usedSecrets.add(secretsItem.name);
                const pluginSecrets = typedSecrets[selectedTechnology.name];
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

export const createBlueprintsInstallationTasks = (
    currentBlueprints: BlueprintsHook,
    selectedTechnologies: GettingStartedSchema
) => {
    const usedBlueprints = new Set();
    const uploadedBlueprints: BlueprintInstallationTask[] = [];
    const scheduledBlueprints: BlueprintInstallationTask[] = [];
    if (currentBlueprints.response) {
        const mappedBlueprints = mapCurrentBlueprints(currentBlueprints.response);
        selectedTechnologies.forEach(selectedTechnology => {
            selectedTechnology.blueprints.forEach(blueprintItem => {
                if (usedBlueprints.has(blueprintItem.id)) {
                    return;
                }
                usedBlueprints.add(blueprintItem.id);
                const blueprintTask = {
                    blueprintName: blueprintItem.name,
                    blueprintUrl: blueprintItem.zipUrl,
                    applicationName: blueprintItem.mainBlueprint ?? ''
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

export const usePluginsInstallationTasks = (selectedTechnologies: GettingStartedSchema) => {
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
            tasks: createPluginInstallationTasks(currentDistribution, currentPlugins, selectedTechnologies)
        };
    }, [currentDistribution, currentPlugins, selectedTechnologies]);
};

export const useSecretsInstallationTasks = (
    selectedTechnologies: GettingStartedSchema,
    typedSecrets: GettingStartedData
) => {
    const currentSecrets = useFetchSecrets();
    const filteredTypedSecrets = useMemo(() => filterSchemaData(selectedTechnologies, typedSecrets), [
        selectedTechnologies,
        typedSecrets
    ]);
    return useMemo(() => {
        if (currentSecrets.loading) {
            return { loading: true as const };
        }
        if (currentSecrets.error) {
            return { loading: false as const, error: currentSecrets.error as string };
        }
        return {
            loading: false,
            tasks: createSecretsInstallationTasks(currentSecrets, selectedTechnologies, filteredTypedSecrets)
        };
    }, [currentSecrets, selectedTechnologies, filteredTypedSecrets]);
};

export const useBlueprintsInstallationTasks = (selectedTechnologies: GettingStartedSchema) => {
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
            tasks: createBlueprintsInstallationTasks(currentBlueprints, selectedTechnologies),
            error: undefined
        };
    }, [currentBlueprints, selectedTechnologies]);
};
