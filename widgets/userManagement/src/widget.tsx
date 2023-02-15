import UsersTable from './UsersTable';
import type { User, UserManagementWidget } from './widget.types';

export interface UserViewItem extends User {
    groupCount: number;
    tenantCount: number;
    isSelected: boolean;
    isAdmin: boolean;
}

export interface FormattedUsers {
    items: UserViewItem[];
    total: number;
}

Stage.defineWidget<UserManagementWidget.Params, UserManagementWidget.Data, UserManagementWidget.Configuration>({
    id: 'userManagement',
    initialWidth: 5,
    initialHeight: 16,
    fetchUrl: {
        users: '[manager]/users?_get_data=true[params]'
    },
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('userManagement'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('username'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (!data || _.isEmpty(data)) {
            return <Loading />;
        }

        const selectedUser = toolbox.getContext().getValue('userName');

        const formattedData: FormattedUsers = {
            items: _.map(data.users.items, item => {
                return {
                    ...item,
                    last_login_at: item.last_login_at ? Stage.Utils.Time.formatTimestamp(item.last_login_at) : '',
                    groupCount: item.groups.length,
                    tenantCount: _.size(item.tenants),
                    isSelected: item.username === selectedUser,
                    isAdmin:
                        item.role === Stage.Common.Consts.sysAdminRole ||
                        _.has(item.group_system_roles, Stage.Common.Consts.sysAdminRole)
                };
            }),
            total: data.users.metadata.pagination.total
        };

        return <UsersTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
