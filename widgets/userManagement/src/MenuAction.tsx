// @ts-nocheck File not migrated fully to TS
import UserPropType from './props/UserPropType';

class MenuAction extends React.Component {
    static CHANGE_PASSWORD_ACTION = 'password';

    static EDIT_TENANTS_ACTION = 'tenants';

    static EDIT_GROUPS_ACTION = 'groups';

    static DELETE_ACTION = 'delete';

    static DEACTIVATE_ACTION = 'deactivate';

    static ACTIVATE_ACTION = 'activate';

    static SET_DEFAULT_USER_ROLE_ACTION = 'set-default-role';

    static SET_ADMIN_USER_ROLE_ACTION = 'set-admin-role';

    static ENABLE_GETTING_STARTED_MODAL_ACTION = 'enable-getting-started-modal';

    static DISABLE_GETTING_STARTED_MODAL_ACTION = 'disable-getting-started-modal';

    actionClick = (proxy, { name }) => {
        const { item, onSelectAction } = this.props;
        onSelectAction(name, item);
    };

    render() {
        const { PopupMenu, Menu } = Stage.Basic;
        const { item, isLocalIdp } = this.props;
        const canChangePassword = isLocalIdp || item.username === Stage.Common.Consts.adminUsername;

        return (
            <PopupMenu>
                <Menu pointing vertical>
                    {canChangePassword && (
                        <Menu.Item
                            icon="lock"
                            content="Change password"
                            name={MenuAction.CHANGE_PASSWORD_ACTION}
                            onClick={this.actionClick}
                        />
                    )}
                    <Menu.Item
                        icon="users"
                        content="Edit user's groups"
                        name={MenuAction.EDIT_GROUPS_ACTION}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="user"
                        content="Edit user's tenants"
                        name={MenuAction.EDIT_TENANTS_ACTION}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="trash"
                        content="Delete"
                        name={MenuAction.DELETE_ACTION}
                        onClick={this.actionClick}
                    />
                </Menu>
            </PopupMenu>
        );
    }
}

MenuAction.propTypes = {
    item: UserPropType.isRequired,
    onSelectAction: PropTypes.func.isRequired,
    isLocalIdp: PropTypes.bool.isRequired
};

export default connectToStore(
    state => ({
        isLocalIdp: Stage.Utils.Idp.isLocal(state.manager)
    }),
    {}
)(MenuAction);
