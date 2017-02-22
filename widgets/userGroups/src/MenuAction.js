/**
 * Created by jakubniezgoda on 03/02/2017.
 */

export default class MenuAction extends React.Component {

    static ADD_USER_ACTION='user';
    static ADD_TENANT_ACTION='tenant';
    static DELETE_ACTION='delete';

    _actionClick(proxy, {name}) {
        this.props.onSelectAction(name, this.props.item);
    }

    render () {
        var {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item icon='users' content='Add user to group' name={MenuAction.ADD_USER_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='user' content='Add group to tenant' name={MenuAction.ADD_TENANT_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                    <Menu.Item icon='trash' content='Delete' name={MenuAction.DELETE_ACTION}
                               onClick={this._actionClick.bind(this)}/>
                </Menu>
            </PopupMenu>
        );
    }
}
