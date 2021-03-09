// export enum PluginStatus {
//     Unknown = 0,
//     InstalledAndParametersMatched = 1,
//     InstalledAndParametersUnmatched = 2,
//     NotInstalledAndInCatalog = 3,
//     UserDefinedPlugin = 4,
//     NotInstalledAndNotInCatalog = 5
// }

// export const getPluginStatus = (pluginName: string, pluginsInManager: any, pluginsInCatalog: any) => {
//     const pluginInManager = pluginsInManager[pluginName];
    
//     if (!pluginInManager) {
//         return PluginStatus.InstalledAndParametersUnmatched;
//     }

//     const pluginInCatalog = pluginsInCatalog[pluginName];

//     if (pluginInManager) {
//         const { version } = pluginInManager;
//         const { distribution } = pluginInManager;
//         if (
//             (version == null || version === pluginInManager.version) &&
//             (distribution == null || distribution === pluginInManager.distribution)
//         ) {
//             return PluginStatus.InstalledAndParametersMatched;
//         }
//         return PluginStatus.InstalledAndParametersUnmatched;
//     }
//     if (pluginInCatalog) {
//         const { version } = pluginInCatalog;
//         if (version == null || version === pluginInCatalog.version) {
//             // TODO: Check distribution
//             return PluginStatus.NotInstalledAndInCatalog;
//         }
//         return PluginStatus.NotInstalledAndNotInCatalog;
//     }
//     return PluginStatus.NotInstalledAndNotInCatalog;
// };
