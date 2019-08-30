/**
 * Created by kinneretzin on 28/03/2017.
 */

import ClusterManagement from './ClusterManagement';

Stage.defineWidget({
    id: 'highAvailability',
    name: 'High Availability',
    description: 'List nodes in High Availability cluster',
    initialWidth: 12,
    initialHeight: 25,
    color: 'green',
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('highAvailability'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES],

    initialConfiguration: [
        Stage.GenericConfig.POLLING_TIME_CONFIG(30),
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        Stage.GenericConfig.SORT_COLUMN_CONFIG('name'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(true)
    ],

    fetchData(widget, toolbox, params) {
        const result = {};
        return toolbox
            .getManager()
            .doGet('/managers')
            .then(data => {
                result.nodes = data;
                return result;
            });
    },

    render(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading />;
        }

        return <ClusterManagement widget={widget} data={data} toolbox={toolbox} />;
    }
});
