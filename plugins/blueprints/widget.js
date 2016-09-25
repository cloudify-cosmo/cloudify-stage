/**
 * Created by kinneretzin on 07/09/2016.
 */


addPlugin({
    id: "blueprints",
    name: "Blueprints list",
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 5,
    color : "blue",
    configure: {
        "name" : 'filterBy',
        "type": "string",
        "isRequired" : false
    },
    //fetchUrl: '/plugins/blueprints/data.json',
    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get('/plugins/blueprints/blueprints.json')
                .done((blueprints)=> {

                    pluginUtils.jQuery.get('/plugins/blueprints/deployments.json')
                        .done((deployments)=>{

                            var depCount = _.countBy(deployments.items,'blueprint_id');
                            // Count deployments
                            _.each(blueprints.items,(blueprint)=>{
                                blueprint.depCount = depCount[blueprint.id];

                            });

                            resolve(blueprints);
                        })
                        .fail(reject);
                })
                .fail(reject)
        });
    },

    events: [
        {
            selector: '.row',
            event: 'click',
            fn: (e,widget,context,pluginUtils)=> {
                var blueprintId = pluginUtils.jQuery(e.currentTarget).data('id');
                var oldSelectedBlueprintId = context.getValue('blueprintId');
                context.setValue('blueprintId',blueprintId === oldSelectedBlueprintId ? null : blueprintId);
            }
        }
        //{
        //    selector: '.blueprintDrilldown',
        //    event: 'click',
        //    fn: (e,widget,context,pluginUtils)=> {
        //        var blueprintId = pluginUtils.jQuery(e.currentTarget).data('id');
        //        context.setValue('blueprintId',blueprintId);
        //
        //        context.drillDown(widget,'template1');
        //    }
        //}
    ],

    render: function(widget,data,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'Blueprints: missing template';
        }

        var selectedBlueprint = context.getValue('blueprintId');
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'),
                    isSelected: selectedBlueprint === item.id
                })
            })
        });
        return pluginUtils.buildFromTemplate(widget.plugin.template,formattedData);
    }
    //attachEvents : function (plugin,context,pluginUtils) {


        //pluginUtils.jQuery('.blueprintName').on('click',function(event) {
        //    //var element = $(event.currentTarget).data('name');
        //    context.setValue('blueprintId',2);
        //});

//    }
});