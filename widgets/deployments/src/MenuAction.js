/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static UPDATE_ACTION='update';
    static DELETE_ACTION='delete';
    static FORCE_DELETE_ACTION='forceDelete';
    static WORKFLOW_ACTION='workflow';

    actionClick(event, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    workflowClick(workflow) {
        this.props.onSelectAction(MenuAction.WORKFLOW_ACTION, this.props.item, workflow);
    }

    render () {
        let {PopupMenu, Menu} = Stage.Basic;
        let {WorkflowsMenu} = Stage.Common;

        return (
            <PopupMenu className="menuAction segmentMenuAction" disabled={this.props.disabled}>
                <Menu pointing vertical>
                    <Menu.Item header>Execute workflow
                        <Menu.Menu>
                            <WorkflowsMenu workflows={this.props.item.workflows} showInPopup={false}
                                           dropdownDirection='left' onClick={this.workflowClick.bind(this)} />
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item icon='edit' content='Update' name={MenuAction.UPDATE_ACTION}
                               onClick={this.actionClick.bind(this)}/>
                    <Menu.Item icon='trash alternate' content='Delete' name={MenuAction.DELETE_ACTION}
                               onClick={this.actionClick.bind(this)}/>
                    <Menu.Item icon='trash' content='Force Delete' name={MenuAction.FORCE_DELETE_ACTION}
                               onClick={this.actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
