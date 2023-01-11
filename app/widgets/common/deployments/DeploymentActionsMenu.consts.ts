export const actions = Object.freeze({
    delete: 'delete',
    forceDelete: 'forceDelete',
    install: 'install',
    manageLabels: 'manageLabels',
    setSite: 'setSite',
    uninstall: 'uninstall',
    update: 'update',
    deployOn: 'deployOn'
});

export const permissions = {
    executeWorkflow: 'execution_start',
    deploymentDelete: 'deployment_delete',
    deploymentUpdateCreate: 'deployment_update_create',
    deploymentSetSite: 'deployment_set_site',
    deploymentCreate: 'deployment_create'
};

export type MenuItem = { name: string; icon: string; permission: string };
export const menuItems: MenuItem[] = [
    { name: actions.install, icon: 'play', permission: permissions.executeWorkflow },
    { name: actions.update, icon: 'edit', permission: permissions.deploymentUpdateCreate },
    { name: actions.deployOn, icon: 'rocket', permission: permissions.deploymentCreate },
    { name: actions.setSite, icon: 'building', permission: permissions.deploymentSetSite },
    { name: actions.manageLabels, icon: 'tags', permission: permissions.deploymentCreate },
    { name: actions.uninstall, icon: 'recycle', permission: permissions.executeWorkflow },
    { name: actions.delete, icon: 'trash alternate', permission: permissions.deploymentDelete },
    { name: actions.forceDelete, icon: 'trash', permission: permissions.deploymentDelete }
];
