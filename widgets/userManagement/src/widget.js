/**
 * Created by pposel on 30/01/2017.
 */

import UsersTable from './UsersTable';

Stage.defineWidget({
    id: 'userManagement',
    name: "User management",
    description: 'This widget shows a list of available users and allow managing them',
    initialWidth: 5,
    initialHeight: 16,
    color: "brown",
    fetchUrl: '[manager]/users?_get_data=true[params]',
    isReact: true,
    isAdmin: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('username'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedUser = toolbox.getContext().getValue('userName');

        let formattedData = data;
        formattedData = Object.assign({}, data, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    last_login_at: item.last_login_at?Stage.Utils.formatTimestamp(item.last_login_at):"",
                    groupCount: item.groups.length,
                    tenantCount: item.tenants.length,
                    isSelected: item.username === selectedUser
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0)
        });

        return (
            <UsersTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
