/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static SET_PASSWORD_ACTION='password';
    static SET_ROLE_ACTION='role';
    static EDIT_TENANTS_ACTION='tenants';
    static EDIT_GROUPS_ACTION='groups';
    static DELETE_ACTION='delete';
    static DEACTIVATE_ACTION = 'deactivate';
    static ACTIVATE_ACTION = 'activate';

    _actionClick(proxy, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    {
                        this.props.item.active ?
                            <Menu.Item icon='ban' content='deactivate' name={MenuAction.DEACTIVATE_ACTION}
                                       onClick={this._actionClick.bind(this)}/>
                        :
                            <Menu.Item icon='ban' content='activate' name={MenuAction.ACTIVATE_ACTION}
                                       onClick={this._actionClick.bind(this)}/>
                    }

                    <Menu.Item icon='lock' content='Set password' name={MenuAction.SET_PASSWORD_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='male' content='Set role' name={MenuAction.SET_ROLE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='users' content="Edit user's groups" name={MenuAction.EDIT_GROUPS_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='user' content="Edit user's tenants" name={MenuAction.EDIT_TENANTS_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='trash' content='Delete' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
