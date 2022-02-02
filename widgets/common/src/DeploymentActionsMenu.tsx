import type { ReactNode, ComponentProps } from 'react';

export const actions = Object.freeze({
    delete: 'delete',
    forceDelete: 'forceDelete',
    install: 'install',
    manageLabels: 'manageLabels',
    setSite: 'setSite',
    uninstall: 'uninstall',
    update: 'update'
});

const translate = Stage.Utils.getT('widgets.common.deployments.actionsMenu');
const menuItems = [
    { name: actions.install, icon: 'play', permission: 'execution_start' },
    { name: actions.update, icon: 'edit', permission: 'deployment_update_create' },
    { name: actions.setSite, icon: 'building', permission: 'deployment_set_site' },
    { name: actions.manageLabels, icon: 'tags', permission: 'deployment_create' },
    { name: actions.uninstall, icon: 'recycle', permission: 'execution_start' },
    { name: actions.delete, icon: 'trash alternate', permission: 'deployment_delete' },
    { name: actions.forceDelete, icon: 'trash', permission: 'deployment_delete' }
];

interface DeploymentActionsMenuProps {
    onActionClick: (actionName: string) => void;
    toolbox: Stage.Types.Toolbox;
    trigger: ReactNode;
}

export default function DeploymentActionsMenu({ onActionClick, toolbox, trigger }: DeploymentActionsMenuProps) {
    const {
        Basic: { Menu, Popup, PopupMenu },
        Utils: { isUserAuthorized },
        i18n
    } = Stage;

    const managerState = toolbox.getManagerState();
    const items = menuItems.map(item => ({
        ...item,
        key: item.name,
        content: translate(item.name),
        disabled: !isUserAuthorized(item.permission, managerState)
    }));
    const popupMenuProps: { bordered?: boolean; help?: string; offset?: [number, number] } = !trigger
        ? { bordered: true, help: i18n.t('widgets.common.deployments.actionsMenu.tooltip'), offset: [0, 5] }
        : {};

    const onItemClick: ComponentProps<typeof Menu>['onItemClick'] = (_event, { name }) => {
        onActionClick(name!);
    };

    return (
        <PopupMenu className="deploymentActionsMenu" {...popupMenuProps}>
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

declare global {
    namespace Stage.Common {
        export { DeploymentActionsMenu };
    }
}

Stage.defineCommon({
    name: 'DeploymentActionsMenu',
    common: DeploymentActionsMenu
});
