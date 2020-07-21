/**
 * Created by jakubniezgoda on 03/02/2017.
 */
import GroupPropType from './props/GroupPropType';

export default class MenuAction extends React.Component {
    static EDIT_USERS_ACTION = 'users';

    static EDIT_TENANTS_ACTION = 'tenants';

    static DELETE_ACTION = 'delete';

    static SET_DEFAULT_GROUP_ROLE_ACTION = 'set-default-role';

    static SET_ADMIN_GROUP_ROLE_ACTION = 'set-admin-role';

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
                        icon="users"
                        content="Edit group's users"
                        name={MenuAction.EDIT_USERS_ACTION}
                        onClick={this.actionClick.bind(this)}
                    />
                    <Menu.Item
                        icon="user"
                        content="Edit group's tenants"
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

MenuAction.propTypes = { item: GroupPropType.isRequired, onSelectAction: PropTypes.func.isRequired };
