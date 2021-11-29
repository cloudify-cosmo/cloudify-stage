import type { FunctionComponent, MouseEvent } from 'react';
import type { MenuItemProps } from 'semantic-ui-react';
import { menuActions } from './consts';

const { i18n } = Stage;
const { PopupMenu, Menu } = Stage.Basic;

interface Item {
    name: string;
    tenants: unknown;
    users: string[];
}

interface MenuActionProps {
    item: Item;
    onSelectAction: (name: string | undefined, item: Item) => void;
}

const MenuAction: FunctionComponent<MenuActionProps> = ({ item, onSelectAction }) => {
    const actionClick = (_proxy: MouseEvent<HTMLAnchorElement>, { name }: MenuItemProps) => {
        onSelectAction(name, item);
    };

    return (
        <PopupMenu>
            <Menu pointing vertical>
                <Menu.Item
                    icon="users"
                    content={i18n.t('widgets.userGroups.menu.editGroupUsers')}
                    name={menuActions.editUsers}
                    onClick={actionClick}
                />
                <Menu.Item
                    icon="user"
                    content={i18n.t('widgets.userGroups.menu.editGroupTenants')}
                    name={menuActions.editTenants}
                    onClick={actionClick}
                />
                <Menu.Item
                    icon="trash"
                    content={i18n.t('widgets.userGroups.menu.delete')}
                    name={menuActions.delete}
                    onClick={actionClick}
                />
            </Menu>
        </PopupMenu>
    );
};

export default MenuAction;
