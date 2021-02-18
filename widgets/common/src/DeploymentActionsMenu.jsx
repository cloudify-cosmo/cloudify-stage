/* eslint-disable react/jsx-props-no-spreading */
const actions = Object.freeze({
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

export default function DeploymentActionsMenu({ deploymentId, toolbox, trigger }) {
    const {
        Basic: { Menu, Popup, PopupMenu },
        Common: {
            ExecuteDeploymentModal,
            ManageLabelsModal,
            UpdateDeploymentModal,
            RemoveDeploymentModal,
            SetSiteModal
        },
        Hooks: { useResettableState }
    } = Stage;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState('');
    const commonProps = { deploymentId, onHide: resetActiveAction, toolbox };

    let workflowName = '';
    if (activeAction === actions.install) {
        workflowName = 'install';
    } else if (activeAction === actions.uninstall) {
        workflowName = 'uninstall';
    }

    function onItemClick(event, { name }) {
        setActiveAction(name);
    }

    return (
        <>
            <PopupMenu className="deploymentActionsMenu">
                {trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}
                <Menu pointing vertical onItemClick={onItemClick} items={menuItems} />
            </PopupMenu>

            <ManageLabelsModal {...commonProps} open={activeAction === actions.manageLabels} />

            <ExecuteDeploymentModal
                {...commonProps}
                open={activeAction === actions.install || activeAction === actions.uninstall}
                workflow={workflowName}
            />

            <UpdateDeploymentModal {...commonProps} open={activeAction === actions.update} />

            <RemoveDeploymentModal
                {...commonProps}
                force={activeAction === actions.forceDelete}
                open={activeAction === actions.delete || activeAction === actions.forceDelete}
            />

            <SetSiteModal {...commonProps} open={activeAction === actions.setSite} />
        </>
    );
}

DeploymentActionsMenu.propTypes = {
    deploymentId: PropTypes.string.isRequired,
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
