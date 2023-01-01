import { isEmpty, map, size, has } from 'lodash';
import type { UserGroup, UserGroupManagmentWidget } from './widget.types';
import UserGroupsTable from './UserGroupsTable';

const t = Stage.Utils.getT('widgets.userGroups');
export interface UserGroupViewItem extends UserGroup {
    tenantCount: number;
    userCount: number;
    isSelected: boolean;
    isAdmin: boolean;
}

export interface UserGroupData {
    items: UserGroupViewItem[];
    total: number;
}

Stage.defineWidget<
    UserGroupManagmentWidget.Params,
    UserGroupManagmentWidget.Data,
    UserGroupManagmentWidget.Configuration
>({
    id: 'userGroups',
    name: t('name'),
    description: t('description'),
    initialWidth: 5,
    initialHeight: 16,
    fetchUrl: '[manager]/user-groups?_get_data=true[params]',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('userGroups'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render(widget, data, _error, toolbox) {
        const { Loading } = Stage.Basic;

        if (!data || isEmpty(data)) {
            return <Loading />;
        }

        const selectedUserGroup = toolbox.getContext().getValue('userGroup');

        const formattedData: UserGroupData = {
            items: map(data.items, item => {
                return {
                    ...item,
                    userCount: item.users.length,
                    tenantCount: size(item.tenants),
                    isSelected: item.name === selectedUserGroup,
                    isAdmin:
                        item.role === Stage.Common.Consts.sysAdminRole ||
                        has(item.group_system_roles, Stage.Common.Consts.sysAdminRole)
                };
            }),
            total: data.metadata.pagination.total
        };

        return <UserGroupsTable widget={widget} data={formattedData} toolbox={toolbox} />;
    }
});
