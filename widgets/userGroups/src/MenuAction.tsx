// @ts-nocheck File not migrated fully to TS
import GroupPropType from './props/GroupPropType';

const { i18n } = Stage;
const { PopupMenu, Menu } = Stage.Basic;

export default class MenuAction extends React.Component {
    static EDIT_USERS_ACTION = 'users';

    static EDIT_TENANTS_ACTION = 'tenants';

    static DELETE_ACTION = 'delete';

    static SET_DEFAULT_GROUP_ROLE_ACTION = 'set-default-role';

    static SET_ADMIN_GROUP_ROLE_ACTION = 'set-admin-role';

    actionClick = (proxy, { name }) => {
        const { item, onSelectAction } = this.props;
        onSelectAction(name, item);
    };

    render() {
        return (
            <PopupMenu>
                <Menu pointing vertical>
                    <Menu.Item
                        icon="users"
                        content={i18n.t('widgets.userGroups.menu.editGroupUsers')}
                        name={MenuAction.EDIT_USERS_ACTION}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="user"
                        content={i18n.t('widgets.userGroups.menu.editGroupTenants')}
                        name={MenuAction.EDIT_TENANTS_ACTION}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="trash"
                        content={i18n.t('widgets.userGroups.menu.delete')}
                        name={MenuAction.DELETE_ACTION}
                        onClick={this.actionClick}
                    />
                </Menu>
            </PopupMenu>
        );
    }
}

MenuAction.propTypes = { item: GroupPropType.isRequired, onSelectAction: PropTypes.func.isRequired };
