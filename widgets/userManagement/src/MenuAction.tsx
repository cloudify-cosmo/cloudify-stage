import type { MenuItemProps } from 'semantic-ui-react';
import type { User } from './widget.types';
import type { ReduxState } from '../../../app/reducers';

export enum MenuActions {
    CHANGE_PASSWORD_ACTION = 'CHANGE_PASSWORD_ACTION',
    EDIT_TENANTS_ACTION = 'EDIT_TENANTS_ACTION',
    EDIT_GROUPS_ACTION = 'EDIT_GROUPS_ACTION',
    DELETE_ACTION = 'DELETE_ACTION',
    DEACTIVATE_ACTION = 'DEACTIVATE_ACTION',
    ACTIVATE_ACTION = 'ACTIVATE_ACTION',
    SET_DEFAULT_USER_ROLE_ACTION = 'SET_DEFAULT_USER_ROLE_ACTION',
    SET_ADMIN_USER_ROLE_ACTION = 'SET_ADMIN_USER_ROLE_ACTION',
    ENABLE_GETTING_STARTED_MODAL_ACTION = 'ENABLE_GETTING_STARTED_MODAL_ACTION',
    DISABLE_GETTING_STARTED_MODAL_ACTION = 'DISABLE_GETTING_STARTED_MODAL_ACTION'
}

interface MenuActionProps {
    item: User;
    onSelectAction: (value: MenuActions, user: User) => void;
    isLocalIdp: boolean;
}

class MenuAction extends React.Component<MenuActionProps> {
    actionClick: MenuItemProps['onClick'] = (_event, { name }) => {
        const { item, onSelectAction } = this.props;
        onSelectAction(name as MenuActions, item);
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
                            name={MenuActions.CHANGE_PASSWORD_ACTION}
                            onClick={this.actionClick}
                        />
                    )}
                    <Menu.Item
                        icon="users"
                        content="Edit user's groups"
                        name={MenuActions.EDIT_GROUPS_ACTION}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="user"
                        content="Edit user's tenants"
                        name={MenuActions.EDIT_TENANTS_ACTION}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="trash"
                        content="Delete"
                        name={MenuActions.DELETE_ACTION}
                        onClick={this.actionClick}
                    />
                </Menu>
            </PopupMenu>
        );
    }
}

export default connectToStore(
    (state: ReduxState) => ({
        isLocalIdp: Stage.Utils.Idp.isLocal(state.manager)
    }),
    {}
)(MenuAction);
