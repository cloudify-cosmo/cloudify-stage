import React, { memo, useMemo } from 'react';
import Manager from '../../../utils/Manager';
import { useManager } from '../managerHooks';
import { JSONData, JSONSchema, SecretData } from '../model';
import { AvailablePluginData, InstalledPluginData } from '../plugins/model';
import useFetchPlugins, { PluginsHook } from '../plugins/useFetchPlugins';
import { getPluginStatus, PluginStatus } from '../plugins/utils';
import useFetchSecrets from '../secrets/useFetchSecrets';

const getCurrentDistribution = (manager: Manager) => {
    const currentDistributionName = manager.getDistributionName().trim();
    const currentDistributionRelease = manager.getDistributionRelease().trim();
    return `${currentDistributionName.toLowerCase()} ${currentDistributionRelease.toLowerCase()}`;
};

const useCurrentDistribution = () => {
    const manager = useManager();
    return useMemo(() => getCurrentDistribution(manager), [manager]);
};

const mapAvailablePlugins = (availablePlugins: AvailablePluginData[]) => {
    return availablePlugins.reduce((result, { name, ...other }) => {
        result[name] = other;
        return result;
    }, {} as Record<string, Omit<AvailablePluginData, 'name'>>);
};

const mapInstalledPlugins = (catalogPlugins: InstalledPluginData[]) => {
    return catalogPlugins.reduce((result, { package_name, ...other }) => {
        result[package_name] = other;
        return result;
    }, {} as Record<string, Omit<InstalledPluginData, 'package_name'>>);
};

const mapDefinedSecrets = (definedSecrets: SecretData[]) => {
    return definedSecrets.reduce((result, { key, ...other }) => {
        if (key) {
            result[key] = other;
        }
        return result;
    }, {} as Record<string, Omit<SecretData, 'name'>>);
};

const createPluginInstallationTasks = (
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

// const getPluginStatuses = (pluginsInBlueprint: any[], pluginsInCatalog: any[], pluginsInManager: any[], currentDistributionCode: string) => {
//     const formattedPluginsInManager = pluginsInManager.reduce((result, pluginObject) => {
//         result[pluginObject.package_name] = {
//             version: pluginObject.package_version,
//             distribution: pluginObject.distribution,
//             visibility: pluginObject.visibility
//         };
//         return result;
//     }, {});

//     const formattedPluginsInCatalog = pluginsInCatalog.reduce((result, { name, ...plugin }) => {
//         result[name] = plugin;
//         return result;
//     }, {});

//     const defaultPluginState = {
//         yamlUrl: '',
//         yamlFile: null,
//         wagonUrl: '',
//         wagonFile: null,
//         iconUrl: '',
//         iconFile: null,
//         visibility: Stage.Common.Consts.defaultVisibility,
//         status: PluginStatus.Unknown
//     };

//     const stepData = {} as Record<string, any>;

//     pluginsInBlueprint.forEach(plugin => {
//         // const pluginState = { ...defaultPluginState, ...stepDataProp[plugin] };
//         const pluginState = { ...defaultPluginState } as any;
//         pluginState.status = getPluginStatus(plugin, formattedPluginsInManager, formattedPluginsInCatalog);

//         if (pluginState.status === PluginStatus.NotInstalledAndInCatalog) {
//             const matchingWagon = formattedPluginsInCatalog[plugin].wagons.find((wagon: any) => {
//                 const wagonName = wagon.name.toLowerCase();
//                 return wagonName === currentDistributionCode || wagonName === 'any';
//             });

//             pluginState.wagonUrl = matchingWagon.url;
//             pluginState.yamlUrl = formattedPluginsInCatalog[plugin].link;
//             pluginState.title = formattedPluginsInCatalog[plugin].title;
//         } else if (pluginState.status === PluginStatus.InstalledAndParametersMatched) {
//             pluginState.visibility = formattedPluginsInManager[plugin].visibility;
//         }

//         stepData[plugin] = { ...pluginState };
//     });

//     return stepData;
// };

type Props = {
    schema: JSONSchema;
    data: JSONData;
};

const SummaryStep = ({ schema, data }: Props) => {
    // TODO: only for testing
    const currentDistribution = useCurrentDistribution();
    const currentPlugins = useFetchPlugins();
    const currentSecrets = useFetchSecrets();
    const pluginInstallationTasks = useMemo(
        () => createPluginInstallationTasks(currentDistribution, currentPlugins, schema),
        [currentDistribution, currentPlugins, schema]
    );
    const secretInstallationTasks = useMemo(() => {
        if (currentSecrets && currentSecrets.secrets) {
            const mappedSecrets = mapDefinedSecrets(currentSecrets.secrets ?? []);;
            schema.forEach(schemaItem => {
                const secretsItem = mappedSecrets[schemaItem.name];
                const dataItem = data[schemaItem.name];
                if (dataItem) {
                    console.log('');
                }
            });
        }
        // if (managerSecrets) {
        // managerSecrets?.items
        // }
        return [];
    }, [currentSecrets, schema, data]);
    return (
        <div>
            {/* <div>Summary & Status body here ...</div> */}
            {currentPlugins.loading && <div>Plugins information loading ...</div>}
            {currentPlugins.error && <div>Error: {currentPlugins.error}</div>}
            {currentSecrets.loading && <div>Secrets information loading ...</div>}
            {currentSecrets.error && <div>Manager error: {currentSecrets.error}</div>}

            <div>TODO List:</div>
            <ol>
                {pluginInstallationTasks.rejectedPlugins.map(rejectedPlugin => {
                    return <li key={rejectedPlugin}>{rejectedPlugin} plugin is not found in catalog nad manager!</li>;
                })}
                {pluginInstallationTasks.installedPlugins.map(installedPlugin => {
                    return <li key={installedPlugin}>{installedPlugin} plugin is already installed!</li>;
                })}
                {pluginInstallationTasks.scheduledPlugins.map(scheduledPlugin => {
                    return <li key={scheduledPlugin}>{scheduledPlugin} plugin will be installed!</li>;
                })}
                {secretInstallationTasks.map(changedSecret => {
                    return <li>456</li>;
                })}
            </ol>

            <br />
            <br />

            <pre>{JSON.stringify(data, null, 4)}</pre>
            <div>
                {currentPlugins.plugins?.installed.map((item, _index) => {
                    return (
                        <div key={item.package_name}>
                            {item.package_name} {item.package_version} {item.distribution}
                        </div>
                    );
                })}
            </div>
            <div>
                {/* {managerSecrets.secrets?.items.map((item, _index) => {
                    return <div key={item.key}>{item.key}</div>;
                })} */}
            </div>
            {/* {managerPlugins.plugins && <pre>{JSON.stringify(managerPlugins.plugins, null, 4)}</pre>} */}
        </div>
    );
};

export default memo(SummaryStep);
