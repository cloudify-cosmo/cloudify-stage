/**
 * Created by Alex on 1/23/2017.
 */

import Settings from './Settings';
import DataFetcher from './DataFetcher';

Stage.defineWidget({
    id: "settings",
    name: "Settings",
    description: 'Shows settings',
    initialWidth: 12,
    initialHeight: 5,
    color: "green",
    isReact: true,

    fetchData: function (widget, toolbox) {
        /*
        var customerId = toolbox.getContext().getValue('customerId');
         */
        const customerId = 123;

        return DataFetcher.fetch(toolbox, customerId);
    },

    render: function(widget,data,error,toolbox) {
        return (
            <Settings widget={widget}
                      data={data}
                      error={error}
                      toolbox={toolbox}
            ></Settings>
        )
    }
});
