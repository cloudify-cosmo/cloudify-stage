import i18n from 'i18next';
import React from 'react';

import PluginTaskItems, { InstalledPluginDescription, RejectedPluginDescription } from './PluginTaskItems';

import type { createPluginInstallationTasks } from '../../installation/tasks';

type Props = {
    tasks?: ReturnType<typeof createPluginInstallationTasks>;
};

const PluginsInstallationTasks = ({ tasks }: Props) => {
    if (!tasks) {
        return null;
    }
    return (
        <>
            <PluginTaskItems tasks={tasks.installedPlugins} description={InstalledPluginDescription} />
            <PluginTaskItems
                tasks={tasks.scheduledPlugins}
                description={i18n.t(
                    'gettingStartedModal.summary.pluginInstallMessageSuffix',
                    'plugin will be installed.'
                )}
            />
            <PluginTaskItems tasks={tasks.rejectedPlugins} description={RejectedPluginDescription} />
        </>
    );
};

export default PluginsInstallationTasks;
