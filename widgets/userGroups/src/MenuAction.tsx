import type { FunctionComponent } from 'react';

const { PopupMenu, Menu } = Stage.Basic;
const t = Stage.Utils.getT('widgets.userGroups.menu');

interface Item {
    name: string;
    tenants: unknown;
    users: string[];
}

interface MenuActionProps {
    item: Item;
    onDelete: (item: Item) => void;
    onEditTenants: (item: Item) => void;
    onEditUsers: (item: Item) => void;
}

const MenuAction: FunctionComponent<MenuActionProps> = ({ item, onEditUsers, onEditTenants, onDelete }) => {
    const handleEditUsers = () => {
        onEditUsers(item);
    };

    const handleEditTenants = () => {
        onEditTenants(item);
    };

    const handleDelete = () => {
        onDelete(item);
    };

    return (
        <PopupMenu>
            <Menu pointing vertical>
                <Menu.Item icon="users" content={t('editGroupUsers')} onClick={handleEditUsers} />
                <Menu.Item icon="user" content={t('editGroupTenants')} onClick={handleEditTenants} />
                <Menu.Item icon="trash" content={t('delete')} onClick={handleDelete} />
            </Menu>
        </PopupMenu>
    );
};

export default MenuAction;
