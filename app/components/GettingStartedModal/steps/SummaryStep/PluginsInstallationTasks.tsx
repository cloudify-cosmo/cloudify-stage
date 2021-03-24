import i18n from 'i18next';
import React from 'react';

import PluginTaskItems, { installedPluginDescription, rejectedPluginDescription } from './PluginTaskItems';

import type { createPluginInstallationTasks } from '../../installation/tasks';

type Props = {
    tasks: ReturnType<typeof createPluginInstallationTasks>;
};

const PluginsInstallationTasks = ({ tasks }: Props) => {
    return (
        <>
            <PluginTaskItems tasks={tasks.installedPlugins} description={installedPluginDescription} />
            <PluginTaskItems
                tasks={tasks.scheduledPlugins}
                description={i18n.t(
                    'gettingStartedModal.summary.pluginInstallMessageSuffix',
                    'plugin will be installed.'
                )}
            />
            <PluginTaskItems tasks={tasks.rejectedPlugins} description={rejectedPluginDescription} />
        </>
    );
};

export default PluginsInstallationTasks;
