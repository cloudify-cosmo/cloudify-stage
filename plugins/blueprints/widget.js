/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    name: "blueprints",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    events: [
        {
            selector: '.blueprintName',
            event: 'click',
            fn: (plugin,context,pluginUtils)=> context.setValue('blueprintId',(context.getValue('blueprintId') || 0 ) + 1)
        }
    ],

    render: function(plugin,context,pluginUtils) {

        if (!plugin.template) {
            return 'Blueprints: missing template';
        }

        return pluginUtils.buildFromTemplate(plugin.template);
    }
    //attachEvents : function (plugin,context,pluginUtils) {


        //pluginUtils.jQuery('.blueprintName').on('click',function(event) {
        //    //var element = $(event.currentTarget).data('name');
        //    context.setValue('blueprintId',2);
        //});

//    }
});