import type { FunctionComponent } from 'react';
import type { UserGroup } from './widget.types';

const { PopupMenu, Menu } = Stage.Basic;
const t = Stage.Utils.getT('widgets.userGroups.menu');

interface MenuActionProps {
    item: UserGroup;
    onDelete: (item: UserGroup) => void;
    onEditTenants: (item: UserGroup) => void;
    onEditUsers: (item: UserGroup) => void;
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
