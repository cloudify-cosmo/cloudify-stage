import React, { memo, useEffect } from 'react';
import useCurrentCallback from '../common/useCurrentCallback';
import { usePluginInstallationTasks, useSecretsInstallationTasks } from '../installationUtils';
import { JSONData, JSONSchema } from '../model';

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
    installationMode?: boolean;
    selectedPlugins: JSONSchema;
    typedSecrets: JSONData;
    onInstallationStarted?: () => void;
    onInstallationFinished?: () => void;
};

// const addPluginsTasks = (plugins, tasks) => {
//     const { toolbox } = this.props;
//     const pluginActions = new Stage.Common.PluginActions(toolbox);

//     _.forEach(_.keys(plugins), pluginName => {
//         const plugin = plugins[pluginName];

//         const createUploadResource = name => ({
//             [name]: { url: plugin[`${name}Url`], file: plugin[`${name}File`] }
//         });

//         tasks.push(
//             new Task(`Upload plugin ${pluginName}`, () =>
//                 pluginActions.doUpload(plugin.visibility, plugin.title, {
//                     ...createUploadResource('wagon'),
//                     ...createUploadResource('yaml'),
//                     ...createUploadResource('icon')
//                 })
//             )
//         );
//     });

//     return Promise.resolve();
// }

// const addSecretsTasks = (secrets, tasks) => {
//     const { toolbox } = this.props;
//     const secretActions = new Stage.Common.SecretActions(toolbox);

//     _.forEach(_.keys(secrets), secret => {
//         const secretValue = secrets[secret].value;
//         const secretVisibility = secrets[secret].visibility;

//         tasks.push(
//             new Task(`Create secret ${secret}`, () =>
//                 secretActions.doCreate(secret, secretValue, secretVisibility, false)
//             )
//         );
//     });

//     return Promise.resolve();
// };

const SummaryStep = ({
    installationMode = false,
    selectedPlugins,
    typedSecrets,
    onInstallationStarted,
    onInstallationFinished
}: Props) => {
    const handleInstallationStarted = useCurrentCallback(onInstallationStarted);
    const handleInstallationFinished = useCurrentCallback(onInstallationFinished);
    const pluginInstallationTasks = usePluginInstallationTasks(selectedPlugins);
    const secretInstallationTasks = useSecretsInstallationTasks(selectedPlugins, typedSecrets);
    useEffect(() => {
        if (installationMode && pluginInstallationTasks.tasks && secretInstallationTasks.tasks) {
            // const pluginActions = new Stage.Common.PluginActions(toolbox);
            console.log('Installation started...');
            handleInstallationStarted();
            return () => {
                console.log('Installation finished or canceled...');
                handleInstallationFinished();
            };
        }
        return undefined;
    }, [installationMode, pluginInstallationTasks, secretInstallationTasks]);
    return (
        <div>
            {pluginInstallationTasks.loading && <div>Plugins information loading ...</div>}
            {pluginInstallationTasks.error && <div>Error: {pluginInstallationTasks.error}</div>}
            {secretInstallationTasks.loading && <div>Secrets information loading ...</div>}
            {secretInstallationTasks.error && <div>Manager error: {secretInstallationTasks.error}</div>}
            {pluginInstallationTasks.tasks && secretInstallationTasks.tasks && (
                <>
                    <div>Tasks:</div>
                    <div>
                        {pluginInstallationTasks.tasks.installedPlugins.map(installedPlugin => {
                            return <div key={installedPlugin}>{installedPlugin} plugin is already installed</div>;
                        })}
                        {pluginInstallationTasks.tasks.scheduledPlugins.map(scheduledPlugin => {
                            return <div key={scheduledPlugin}>{scheduledPlugin} plugin will be installed</div>;
                        })}
                        {pluginInstallationTasks.tasks.rejectedPlugins.map(rejectedPlugin => {
                            return (
                                <div key={rejectedPlugin}>
                                    {rejectedPlugin} plugin is not found in catalog nad manager
                                </div>
                            );
                        })}
                        {secretInstallationTasks.tasks.createdSecrets.map(createdSecret => {
                            return <div key={createdSecret}>{createdSecret} secret will be created</div>;
                        })}
                        {secretInstallationTasks.tasks.updatedSecrets.map(updatedSecret => {
                            return <div key={updatedSecret}>{updatedSecret} secret will be updated</div>;
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(SummaryStep);
