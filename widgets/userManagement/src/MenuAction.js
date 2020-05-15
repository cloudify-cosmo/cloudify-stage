/**
 * Created by kinneretzin on 19/10/2016.
 */

export default class MenuAction extends React.Component {
    static SET_PASSWORD_ACTION = 'password';

    static EDIT_TENANTS_ACTION = 'tenants';

    static EDIT_GROUPS_ACTION = 'groups';

    static DELETE_ACTION = 'delete';

    static DEACTIVATE_ACTION = 'deactivate';

    static ACTIVATE_ACTION = 'activate';

    static SET_DEFAULT_USER_ROLE_ACTION = 'set-default-role';

    static SET_ADMIN_USER_ROLE_ACTION = 'set-admin-role';

    actionClick(proxy, { name }) {
        const { item, onSelectAction } = this.props;
        onSelectAction(name, item);
    }

    render() {
        const { PopupMenu, Menu } = Stage.Basic;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item
                        icon="lock"
                        content="Set password"
                        name={MenuAction.SET_PASSWORD_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="users"
                        content="Edit user's groups"
                        name={MenuAction.EDIT_GROUPS_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="user"
                        content="Edit user's tenants"
                        name={MenuAction.EDIT_TENANTS_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="trash"
                        content="Delete"
                        name={MenuAction.DELETE_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                </Menu>
            </PopupMenu>
        );
    }
}
