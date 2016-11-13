/**
 * Created by kinneretzin on 07/09/2016.
 */

import DataFetcher from './DataFetcher';
import Filter from './Filter';

Stage.addPlugin({
    id: 'filter',
    name: "Filter by blueprint/deployment/execution",
    description: 'Adds a filter section for blueprints, deployments and execution list',
    initialWidth: 12,
    initialHeight: 1,
    color: "yellow",
    showHeader: false,
    showBorder: false,
    fetchData: function(plugin,context,pluginUtils) {
        return DataFetcher.fetch(context.getManagerUrl);
    },

    isReact: true,
    initialConfiguration:
        [
            {id: "FilterByExecutions",name: "Should show execution filter", placeHolder: "True of false if to show execution filter as well", default: "true"}
        ],

    render: function(widget,data,error,context,pluginUtils) {
        if (_.isEmpty(data)) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        return (
            <Filter widget={widget} data={data} context={context} utils={pluginUtils}/>
        );

    }
});