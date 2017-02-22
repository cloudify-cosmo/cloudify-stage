/**
 * Created by jakubniezgoda on 01/02/2017.
 */

let PropTypes = React.PropTypes;

export default class MenuAction extends React.Component {

    static EDIT_USERS_ACTION = 'users';
    static EDIT_USER_GROUPS_ACTION = 'user-groups';
    static DELETE_TENANT_ACTION = 'delete';

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        onSelectAction: PropTypes.func.isRequired
    };

    _onDropdownChange(event, {name}) {
        this.props.onSelectAction(name, this.props.tenant);
    }

    render () {
        let {PopupMenu, Menu} = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item icon='user' content='Edit users' name={MenuAction.EDIT_USERS_ACTION}
                               onClick={this._onDropdownChange.bind(this)}/>
                    <Menu.Item icon='users' content='Edit user groups' name={MenuAction.EDIT_USER_GROUPS_ACTION}
                               onClick={this._onDropdownChange.bind(this)}/>
                    <Menu.Item icon='trash' content='Delete' name={MenuAction.DELETE_TENANT_ACTION}
                               onClick={this._onDropdownChange.bind(this)}/>
                </Menu>
            </PopupMenu>
        )
    }
}
