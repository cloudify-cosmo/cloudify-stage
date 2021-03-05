
// const fetchData = async (manager: any, internal: any) => {
//     const [pluginsInManager, pluginsInCatalog] = await Promise.all([
//         manager.doGet('/plugins?_include=distribution,package_name,package_version,visibility'),
//         internal.doGet('/external/content', { url: Stage.i18n.t('widgets.common.urls.pluginsCatalog') })
//     ]);
//     const pluginsInBlueprint = _.get(wizardData, PluginsStepContent.blueprintDataPath, {});
//     const pluginsInUserResources = _.get(wizardData, PluginsStepContent.userDataPath, {});

//     let formattedPluginsInManager = pluginsInManager.items;
//     formattedPluginsInManager = _.reduce(
//         formattedPluginsInManager,
//         (result, pluginObject) => {
//             result[pluginObject.package_name] = {
//                 version: pluginObject.package_version,
//                 distribution: pluginObject.distribution,
//                 visibility: pluginObject.visibility
//             };
//             return result;
//         },
//         {} as any
//     );

//     const formattedPluginsInCatalog = _.reduce(
//         pluginsInCatalog,
//         (result, pluginObject) => {
//             result[pluginObject.name] = {
//                 ..._.omit(pluginObject, 'name')
//             };
//             return result;
//         },
//         {} as any
//     );

//     const stepData = {};
//     _.forEach(_.keys(pluginsInBlueprint), plugin => {
//         const pluginState = { ...PluginsStepContent.defaultPluginState, ...stepDataProp[plugin] };
//         pluginState.status = PluginsStepContent.getPluginStatus(
//             plugin,
//             pluginsInBlueprint,
//             formattedPluginsInManager,
//             formattedPluginsInCatalog
//         );

//         if (pluginState.status === pluginStatuses.notInstalledAndInCatalog) {
//             const distro = `${toolbox
//                 .getManager()
//                 .getDistributionName()
//                 .toLowerCase()} ${toolbox.getManager().getDistributionRelease().toLowerCase()}`;
//             const matchingWagon = _.find(
//                 formattedPluginsInCatalog[plugin].wagons,
//                 wagon => wagon.name.toLowerCase() === distro || wagon.name.toLowerCase() === 'any'
//             );

//             pluginState.wagonUrl = matchingWagon.url;
//             pluginState.yamlUrl = formattedPluginsInCatalog[plugin].link;
//             pluginState.title = formattedPluginsInCatalog[plugin].title;
//         } else if (pluginState.status === pluginStatuses.installedAndParametersMatched) {
//             pluginState.visibility = formattedPluginsInManager[plugin].visibility;
//         }

//         stepData[plugin] = { ...pluginState };
//     });
//     _.forEach(_.keys(pluginsInUserResources), plugin => {
//         const pluginState = { ...PluginsStepContent.defaultPluginState, ...stepDataProp[plugin] };
//         pluginState.status = pluginStatuses.userDefinedPlugin;

//         stepData[plugin] = { ...pluginState };
//     });

//     return { stepData, pluginsInCatalog: formattedPluginsInCatalog };
// };