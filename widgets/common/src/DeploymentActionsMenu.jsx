export const actions = Object.freeze({
    delete: 'delete',
    forceDelete: 'forceDelete',
    install: 'install',
    manageLabels: 'manageLabels',
    setSite: 'setSite',
    uninstall: 'uninstall',
    update: 'update'
});

const translate = (key, params) => Stage.i18n.t(`widgets.common.deployments.actionsMenu.${key}`, params);
const menuItems = [
    { name: actions.install, icon: 'play', permission: 'execution_start' },
    { name: actions.update, icon: 'edit', permission: 'deployment_update_create' },
    { name: actions.setSite, icon: 'building', permission: 'deployment_set_site' },
    { name: actions.manageLabels, icon: 'tags', permission: 'deployment_create' },
    { name: actions.uninstall, icon: 'recycle', permission: 'execution_start' },
    { name: actions.delete, icon: 'trash alternate', permission: 'deployment_delete' },
    { name: actions.forceDelete, icon: 'trash', permission: 'deployment_delete' }
];

export default function DeploymentActionsMenu({ onActionClick, toolbox, trigger }) {
    const {
        Basic: { Menu, Popup, PopupMenu },
        Utils: { isUserAuthorized }
    } = Stage;

    const managerState = toolbox.getManagerState();
    const items = menuItems.map(item => ({
        ...item,
        key: item.name,
        content: translate(item.name),
        disabled: !isUserAuthorized(item.permission, managerState)
    }));

    function onItemClick(event, { name }) {
        onActionClick(name);
    }

    return (
        <PopupMenu className="deploymentActionsMenu">
            {trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}
            <Menu pointing vertical onItemClick={onItemClick} items={items} />
        </PopupMenu>
    );
}

DeploymentActionsMenu.propTypes = {
    onActionClick: PropTypes.func.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired,
    trigger: PropTypes.node
};

DeploymentActionsMenu.defaultProps = {
    trigger: null
};

Stage.defineCommon({
    name: 'DeploymentActionsMenu',
    common: DeploymentActionsMenu
});
