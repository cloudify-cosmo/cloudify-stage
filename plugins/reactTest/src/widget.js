/**
 * Created by kinneretzin on 02/10/2016.
 */

import MyComponent from './component';

addPlugin({
    id: "reactTest",
    name: 'A React test',
    description: 'see if we can use react here',
    initialWidth: 4,
    initialHeight: 2,
    color: "violet",
    initialConfiguration: {filterBy: ""},
    showHeader: true,
    isReact : true,
    //init: function(pluginUtils) {
    //
    //},
    render: function(widget,data,error,context,pluginUtils) {
        return <MyComponent/>;

        //return pluginUtils.buildFromTemplate(widget.plugin.template);
    },
    postRender: function(el,plugin,data,context,pluginUtils) {
    }
});
