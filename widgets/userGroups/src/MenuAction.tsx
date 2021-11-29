import type { FunctionComponent, MouseEvent } from 'react';
import type { MenuItemProps } from 'semantic-ui-react';
import { menuActions } from './consts';

const { PopupMenu, Menu } = Stage.Basic;
const t = Stage.Utils.getT('widgets.userGroups.menu');

interface Item {
    name: string;
    tenants: unknown;
    users: string[];
}

interface MenuActionProps {
    item: Item;
    onSelectAction: (actionName: string, item: Item) => void;
}

const MenuAction: FunctionComponent<MenuActionProps> = ({ item, onSelectAction }) => {
    const actionClick = (_proxy: MouseEvent<HTMLAnchorElement>, { name }: MenuItemProps) => {
        onSelectAction(name as string, item);
    };

    return (
        <PopupMenu>
            <Menu pointing vertical>
                <Menu.Item
                    icon="users"
                    content={t('editGroupUsers')}
                    name={menuActions.editUsers}
                    onClick={actionClick}
                />
                <Menu.Item
                    icon="user"
                    content={t('editGroupTenants')}
                    name={menuActions.editTenants}
                    onClick={actionClick}
                />
                <Menu.Item icon="trash" content={t('delete')} name={menuActions.delete} onClick={actionClick} />
            </Menu>
        </PopupMenu>
    );
};

export default MenuAction;
