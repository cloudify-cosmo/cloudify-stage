/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: "deployments",
    name: 'Blueprint deployments',
    description: 'blah blah blah',
    initialWidth: 8,
    initialHeight: 6,
    color : "purple",
    fetchUrl: '[manager]/api/v2.1/deployments',
    events: [
        {
            selector: '.row',
            event: 'click',
            fn: (e,widget,context,pluginUtils)=> {
                var deploymentId = pluginUtils.jQuery(e.currentTarget).data('id');
                context.setValue('deploymentId',deploymentId);

                context.drillDown(widget,'deployment');
            }
        }

    ],

    render: function(widget,data,error,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'deployments: missing template';
        }

        var formattedData = Object.assign({},data);
        var blueprintId = context.getValue('blueprintId');
        var filter = context.getValue('filterDep'+widget.id);
        if (blueprintId) {
            formattedData.items = _.filter(data.items,{blueprint_id:blueprintId});
        }
        if (filter) {
            formattedData.items = _.filter(formattedData.items,{status:filter});
        }

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    created_at: pluginUtils.moment(item.created_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm'), //2016-07-20 09:10:53.103579
                    updated_at: pluginUtils.moment(item.updated_at,'YYYY-MM-DD HH:mm:ss.SSSSS').format('DD-MM-YYYY HH:mm')
                })
            })
        });

        formattedData.blueprintId = blueprintId;

        return pluginUtils.buildFromTemplate(widget.plugin.template,formattedData);
    },

    postRender: function(el,widget,data,context,pluginUtils) {
        pluginUtils.jQuery(el).find('.ui.dropdown').dropdown({
            onChange: (value, text, $choice) => {
                context.setValue('filterDep'+widget.id,value);
            }
        });

        var filter = context.getValue('filterDep'+widget.id);
        if (filter) {
            pluginUtils.jQuery(el).find('.ui.dropdown').dropdown('set selected',filter);
        }

    }
});
