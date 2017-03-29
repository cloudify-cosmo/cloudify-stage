/**
 * Created by jakubniezgoda on 24/03/2017.
 */

import SecretsTable from './SecretsTable';

Stage.defineWidget({
    id: 'secrets',
    name: 'Secrets management',
    description: 'This widget shows a list of available secrets and allow managing them',
    initialWidth: 5,
    initialHeight: 16,
    color: 'red',
    fetchUrl: '[manager]/secrets[params]',
    isReact: true,
    isAdmin: true,
    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(10),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('key'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let formattedData = data;
        formattedData = Object.assign({}, formattedData, {
            items: _.map (formattedData.items, (item) => {
                return Object.assign({}, item, {
                    created_at: Stage.Utils.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.formatTimestamp(item.updated_at)
                })
            }),
            total : _.get(data, 'metadata.pagination.total', 0)
        });

        return (
            <SecretsTable widget={widget} data={formattedData} toolbox={toolbox}/>
        );

    }
});
