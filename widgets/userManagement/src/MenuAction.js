/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {

    static SET_PASSWORD_ACTION='password';
    static SET_ROLE_ACTION='role';
    static ADD_TENANT_ACTION='tenant';
    static ADD_GROUP_ACTION='group';
    static DELETE_ACTION='delete';

    _actionClick(proxy, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item icon='lock' content='Set password' name={MenuAction.SET_PASSWORD_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='male' content='Set role' name={MenuAction.SET_ROLE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='users' content='Add to group' name={MenuAction.ADD_GROUP_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='user' content='Add to tenant' name={MenuAction.ADD_TENANT_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='trash' content='Delete' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
