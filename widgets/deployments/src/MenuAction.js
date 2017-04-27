/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static EDIT_ACTION='edit';
    static DELETE_ACTION='delete';
    static FORCE_DELETE_ACTION='forceDelete';
    static WORKFLOW_ACTION='workflow';

    _actionClick(workflowAction, proxy, {name}) {
        if (workflowAction) {
            var workflow = _.find(this.props.item.workflows,{name});
            console.log('selected workflow '+ name,workflow);
            this.props.onSelectAction(name, this.props.item, workflow);
        } else {
            this.props.onSelectAction(name, this.props.item);
        }
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu className="menuAction">
                <Menu pointing vertical>
                    <Menu.Item header>Execute workflow
                        <Menu.Menu>
                            {
                                this.props.item.workflows.map((workflow) => {
                                    return <Menu.Item name={workflow.name} onClick={this._actionClick.bind(this, true)} key={workflow.name}>
                                                {_.capitalize(_.lowerCase(workflow.name))}
                                           </Menu.Item>
                                })
                            }
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item icon='edit' content='Edit' name={MenuAction.EDIT_ACTION}
                                   onClick={this._actionClick.bind(this, false)}/>
                    <Menu.Item icon='trash outline' content='Delete' name={MenuAction.DELETE_ACTION}
                                   onClick={this._actionClick.bind(this, false)}/>
                    <Menu.Item icon='trash' content='Force Delete' name={MenuAction.FORCE_DELETE_ACTION}
                               onClick={this._actionClick.bind(this, false)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
