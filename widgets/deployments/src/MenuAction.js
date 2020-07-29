/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {
    static UPDATE_ACTION = 'update';

    static DELETE_ACTION = 'delete';

    static SET_SITE_ACTION = 'setSite';

    static FORCE_DELETE_ACTION = 'forceDelete';

    static WORKFLOW_ACTION = 'workflow';

    actionClick(event, { name }) {
        const { item, onSelectAction } = this.props;
        onSelectAction(name, item);
    }

    workflowClick(workflow) {
        const { item, onSelectAction } = this.props;
        onSelectAction(MenuAction.WORKFLOW_ACTION, item, workflow);
    }

    render() {
        const { item } = this.props;
        const { PopupMenu, Menu } = Stage.Basic;
        const { WorkflowsMenu } = Stage.Common;

        const installWorkflow = _.find(item.workflows, ['name', 'install']);
        const uninstallWorkflow = _.find(item.workflows, ['name', 'uninstall']);

        return (
            <PopupMenu className="menuAction segmentMenuAction">
                <Menu pointing vertical>
                    <Menu.Item header>
                        Execute workflow
                        <Menu.Menu>
                            <WorkflowsMenu
                                workflows={item.workflows}
                                showInPopup={false}
                                dropdownDirection="left"
                                onClick={this.workflowClick.bind(this)}
                            />
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item icon="play" content="Install" onClick={() => this.workflowClick(installWorkflow)} />
                    <Menu.Item
                        icon="edit"
                        content="Update"
                        name={MenuAction.UPDATE_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="building"
                        content="Set Site"
                        name={MenuAction.SET_SITE_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="recycle"
                        content="Uninstall"
                        onClick={() => this.workflowClick(uninstallWorkflow)}
                    />
                    <Menu.Item
                        icon="trash alternate"
                        content="Delete"
                        name={MenuAction.DELETE_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="trash"
                        content="Force Delete"
                        name={MenuAction.FORCE_DELETE_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                </Menu>
            </PopupMenu>
        );
    }
}

MenuAction.propTypes = {
    item: PropTypes.shape({ workflows: PropTypes.arrayOf(PropTypes.shape({})) }).isRequired,
    onSelectAction: PropTypes.func.isRequired
};
