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

export default function DeploymentActionsMenu({ deploymentId, onSelectAction, toolbox }) {
    const {
        Basic: { ErrorMessage, Menu, Popup, PopupMenu },
        Common: {
            ExecuteDeploymentModal,
            ManageLabelsModal,
            UpdateDeploymentModal,
            RemoveDeploymentModal,
            SetSiteModal
        },
        Hooks: { useResettableState }
    } = Stage;

    const [deployment, setDeployment, resetDeployment] = useResettableState({});
    const [workflow, setWorkflow, resetWorkflow] = useResettableState({});
    const [openModal, setOpenModal, resetOpenModal] = useResettableState('');
    const [error, setError, resetError] = useResettableState('');

    /**
     * Fetches deployment resource and updates `deployment` state variable.
     *
     * @param {Array<string>} fieldsToInclude - list of strings passed to
     *                        _include query parameter
     * @returns {Promise}
     */
    function fetchDeployment(fieldsToInclude) {
        const { DeploymentActions } = Stage.Common;
        const deploymentActions = new DeploymentActions(toolbox);
        const params = _.isEmpty(fieldsToInclude) ? {} : { _include: _.join(fieldsToInclude, ',') };

        return deploymentActions.doGet({ id: deploymentId }, params).then(setDeployment);
    }

    function onModalHide(name) {
        resetDeployment();
        resetWorkflow();
        resetOpenModal();
        onSelectAction(name);
    }

    async function onItemClick(event, { name }) {
        resetError();
        try {
            switch (name) {
                case actions.install:
                case actions.uninstall:
                    await fetchDeployment();
                    setWorkflow(_.find(deployment.workflows, ['name', name]));
                    setOpenModal(name);
                    break;

                case actions.delete:
                case actions.forceDelete:
                case actions.manageLabels:
                case actions.setSite:
                case actions.update:
                    setOpenModal(name);
                    break;

                default:
                    onModalHide();
                    break;
            }
        } catch (caughtError) {
            const errorString = translate('fetchError', { deploymentId });
            log.error(errorString, caughtError);
            setError(errorString);
        }
    }

    return (
        <>
            <Popup
                open={error !== ''}
                trigger={
                    <PopupMenu className="deploymentActionsMenu">
                        <Menu pointing vertical onItemClick={onItemClick} items={menuItems} />
                    </PopupMenu>
                }
                content={<ErrorMessage autoHide error={error} onDismiss={resetError} />}
                pinned
                wide
            />

            <ManageLabelsModal
                deploymentId={deploymentId}
                onHide={onModalHide}
                open={openModal === actions.manageLabels}
                toolbox={toolbox}
            />

            <ExecuteDeploymentModal
                deployment={{ id: deploymentId }}
                onExecute={_.noop} // TODO: Fix it!
                onHide={onModalHide}
                open={openModal === actions.install || openModal === actions.uninstall}
                toolbox={toolbox}
                workflow={workflow}
            />

            <UpdateDeploymentModal
                deploymentId={deploymentId}
                onHide={onModalHide}
                open={openModal === actions.update}
                toolbox={toolbox}
            />

            <RemoveDeploymentModal
                deploymentId={deploymentId}
                force={openModal === actions.forceDelete}
                onHide={onModalHide}
                open={openModal === actions.delete || openModal === actions.forceDelete}
                toolbox={toolbox}
            />

            <SetSiteModal
                deploymentId={deploymentId}
                onHide={onModalHide}
                open={openModal === actions.setSite}
                toolbox={toolbox}
            />
        </>
    );
}

DeploymentActionsMenu.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    onSelectAction: PropTypes.func.isRequired, // TODO: Implement proper handling
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

Stage.defineCommon({
    name: 'DeploymentActionsMenu',
    common: DeploymentActionsMenu
});
