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
    { name: actions.install, icon: 'play' },
    { name: actions.update, icon: 'edit' },
    { name: actions.setSite, icon: 'building' },
    { name: actions.manageLabels, icon: 'tags' },
    { name: actions.uninstall, icon: 'recycle' },
    { name: actions.delete, icon: 'trash alternate' },
    { name: actions.forceDelete, icon: 'trash' }
].map(item => ({ ...item, key: item.name, content: translate(item.name) }));

export default function DeploymentActionsMenu({ onActionClick, trigger }) {
    const {
        Basic: { Menu, Popup, PopupMenu }
    } = Stage;

    function onItemClick(event, { name }) {
        onActionClick(name);
    }

    return (
        <PopupMenu className="deploymentActionsMenu">
            {trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}
            <Menu pointing vertical onItemClick={onItemClick} items={menuItems} />
        </PopupMenu>
    );
}

DeploymentActionsMenu.propTypes = {
    onActionClick: PropTypes.func.isRequired,
    trigger: PropTypes.node
};

DeploymentActionsMenu.defaultProps = {
    trigger: null
};

Stage.defineCommon({
    name: 'DeploymentActionsMenu',
    common: DeploymentActionsMenu
});
