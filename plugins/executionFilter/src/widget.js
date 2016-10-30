/**
 * Created by kinneretzin on 07/09/2016.
 */

import DataFetcher from './DataFetcher';
import ExecutionFilter from './ExecutionFilter';

Stage.addPlugin({
    id: 'executionFilter',
    name: "Execution Filters",
    description: 'Adds a filter section for executions list',
    initialWidth: 12,
    initialHeight: 1,
    color: "yellow",
    showHeader: false,
    showBorder: false,
    fetchData: function(plugin,context,pluginUtils) {
        return DataFetcher.fetch(context.getManagerUrl());
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
            <ExecutionFilter widget={widget} data={data} context={context} utils={pluginUtils}/>
        );

    }
});