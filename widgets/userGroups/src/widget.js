/**
 * Created by pposel on 30/01/2017.
 */

import UserGroupsTable from './UserGroupsTable';

Stage.defineWidget({
    id: 'userGroups',
    name: 'User group management',
    description: 'This widget shows a list of available user groups and allow managing them',
    initialWidth: 5,
    initialHeight: 16,
    color: 'violet',
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

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedUserGroup = toolbox.getContext().getValue('userGroup');

        let formattedData = data;
        formattedData = Object.assign({}, data, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    userCount: item.users.length,
                    tenantCount: _.size(item.tenants),
                    isSelected: item.name === selectedUserGroup,
                    isAdmin: item.role === Stage.Common.Consts.sysAdminRole ||
                             _.has(item.group_system_roles, Stage.Common.Consts.sysAdminRole)
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0)
        });

        var roles = _.map (toolbox.getManager().getSystemRoles(), (role) => {
            return {text: role.description ? `${role.name} - ${role.description}` : role.name, value: role.name};
        });

        return (
            <UserGroupsTable widget={widget} data={formattedData} roles={roles} toolbox={toolbox}/>
        );

    }
});
