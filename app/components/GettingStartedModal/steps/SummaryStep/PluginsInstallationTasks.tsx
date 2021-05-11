import i18n from 'i18next';
import React from 'react';

import PluginTaskItems, { PluginExistsDescription, RejectedPluginDescription } from './PluginTaskItems';

import type { createPluginInstallationTasks } from '../../installation/tasks';

type Props = {
    tasks?: ReturnType<typeof createPluginInstallationTasks>;
    statuses?: Record<string, string>;
};

const PluginsInstallationTasks = ({ tasks, statuses }: Props) => {
    if (!tasks) {
        return null;
    }
    return (
        <>
            <PluginTaskItems tasks={tasks.installedPlugins} description={<PluginExistsDescription />} />
            <PluginTaskItems
                tasks={tasks.scheduledPlugins}
                statuses={statuses}
                description={i18n.t('gettingStartedModal.summary.pluginInstallMessageSuffix')}
            />
            <PluginTaskItems tasks={tasks.rejectedPlugins} description={<RejectedPluginDescription />} />
        </>
    );
};

export default PluginsInstallationTasks;
