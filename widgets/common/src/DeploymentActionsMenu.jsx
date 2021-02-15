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
    { key: actions.install, name: actions.install, icon: 'play', content: translate(actions.install) },
    { key: actions.update, name: actions.update, icon: 'edit', content: translate(actions.update) },
    { key: actions.setSite, name: actions.setSite, icon: 'building', content: translate(actions.setSite) },
    { key: actions.manageLabels, name: actions.manageLabels, icon: 'tags', content: translate(actions.manageLabels) },
    { key: actions.uninstall, name: actions.uninstall, icon: 'recycle', content: translate(actions.uninstall) },
    { key: actions.delete, name: actions.delete, icon: 'trash alternate', content: translate(actions.delete) },
    { key: actions.forceDelete, name: actions.forceDelete, icon: 'trash', content: translate(actions.forceDelete) }
];

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

    const [openModal, setOpenModal, resetOpenModal] = useResettableState('');

    let workflowName = '';
    if (openModal === actions.install) {
        workflowName = 'install';
    } else if (openModal === actions.uninstall) {
        workflowName = 'uninstall';
    }

    function onItemClick(event, { name }) {
        setOpenModal(name);
    }

    return (
        <>
            <PopupMenu className="deploymentActionsMenu">
                {trigger && <Popup.Trigger>{trigger}</Popup.Trigger>}
                <Menu pointing vertical onItemClick={onItemClick} items={menuItems} />
            </PopupMenu>

            <ManageLabelsModal
                deploymentId={deploymentId}
                onHide={resetOpenModal}
                open={openModal === actions.manageLabels}
                toolbox={toolbox}
            />

            <ExecuteDeploymentModal
                deploymentId={deploymentId}
                onHide={resetOpenModal}
                open={openModal === actions.install || openModal === actions.uninstall}
                toolbox={toolbox}
                workflow={workflowName}
            />

            <UpdateDeploymentModal
                deploymentId={deploymentId}
                onHide={resetOpenModal}
                open={openModal === actions.update}
                toolbox={toolbox}
            />

            <RemoveDeploymentModal
                deploymentId={deploymentId}
                force={openModal === actions.forceDelete}
                onHide={resetOpenModal}
                open={openModal === actions.delete || openModal === actions.forceDelete}
                toolbox={toolbox}
            />

            <SetSiteModal
                deploymentId={deploymentId}
                onHide={resetOpenModal}
                open={openModal === actions.setSite}
                toolbox={toolbox}
            />
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
