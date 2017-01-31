/**
 * Created by kinneretzin on 30/01/2017.
 */

import TenantsTable from './TenantsTable';

Stage.defineWidget({
    id: 'tenants',
    name: 'Tenants management',
    description: 'This widget shows a list of available tenants, and allow managing them',
    initialWidth: 5,
    initialHeight: 4,
    color: 'green',
    fetchUrl: {
        tenants: '[manager]/tenants[params]',
        users: '[manager]/users',
        userGroups: '[manager]/user-groups',
    },
    isReact: true,
    isAdmin: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG()
    ],

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedTenant = toolbox.getContext().getValue('tenantName');

        let formattedData = data.tenants;
        formattedData = Object.assign({}, formattedData, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    groups: item.groups,
                    users: item.users,
                    isSelected: item.name === selectedTenant
                })
            }),
            users: _.map (data.users.items, (user) => user.username),
            userGroups: _.map (data.userGroups.items, (userGroup) => userGroup.name),
            total : _.get(data.tenants, 'metadata.pagination.total', 0)
        });

        return (
            <TenantsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
