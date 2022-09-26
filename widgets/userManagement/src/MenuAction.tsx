import type { MenuItemProps } from 'semantic-ui-react';
import type { User } from './widget.types';
import type { ReduxState } from '../../../app/reducers';
import getWidgetT from './getWidgetT';

const tAction = (key: string) => getWidgetT()(`actions.${key}`);

export enum Action {
    CHANGE_PASSWORD_ACTION,
    EDIT_TENANTS_ACTION,
    EDIT_GROUPS_ACTION,
    DELETE_ACTION,
    DEACTIVATE_ACTION,
    ACTIVATE_ACTION,
    SET_DEFAULT_USER_ROLE_ACTION,
    SET_ADMIN_USER_ROLE_ACTION,
    ENABLE_GETTING_STARTED_MODAL_ACTION,
    DISABLE_GETTING_STARTED_MODAL_ACTION
}
type ActionName = keyof typeof Action;

interface MenuActionProps {
    item: User;
    onSelectAction: (action: Action, user: User) => void;
    isLocalIdp: boolean;
}

class MenuAction extends React.Component<MenuActionProps> {
    actionClick: MenuItemProps['onClick'] = (_event, { name }) => {
        const { item, onSelectAction } = this.props;
        const actionName = name as ActionName;
        onSelectAction(Action[actionName], item);
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
                            content={tAction('changePassword')}
                            name={Action[Action.CHANGE_PASSWORD_ACTION]}
                            onClick={this.actionClick}
                        />
                    )}
                    <Menu.Item
                        icon="users"
                        content={tAction('editGroups')}
                        name={Action[Action.EDIT_GROUPS_ACTION]}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="user"
                        content={tAction('editTenants')}
                        name={Action[Action.EDIT_TENANTS_ACTION]}
                        onClick={this.actionClick}
                    />
                    <Menu.Item
                        icon="trash"
                        content={tAction('delete')}
                        name={Action[Action.DELETE_ACTION]}
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
