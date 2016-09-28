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
    fetchData: function(plugin,context,pluginUtils) {
        return new Promise( (resolve,reject) => {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/blueprints?_include=id,updated_at,created_at,description',
                dataType: 'json'
                })
                .done((blueprints)=> {

                    pluginUtils.jQuery.get({
                        url: context.getManagerUrl() + '/api/v2.1/deployments?_include=id,blueprint_id',
                        dataType: 'json'
                        })
                        .done((deployments)=>{

                            var depCount = _.countBy(deployments.items,'blueprint_id');
                            // Count deployments
                            _.each(blueprints.items,(blueprint)=>{
                                blueprint.depCount = depCount[blueprint.id] || 0;

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
        },
        {
            selector: '.uploadBlueprint',
            event: 'click',
            fn: (e,widget,context,pluginUtils)=> {
                pluginUtils.jQuery('.uploadBlueprintModal').modal('show');
            }
        },
        {
            selector: '.uploadBlueprintFile',
            event: 'click',
            fn: (e,widget,context,pluginUtils)=> {
                e.preventDefault();
                pluginUtils.jQuery('#blueprintFile').click();
                return false;
            }
        },
        {
            selector: '#blueprintFile',
            event: 'change',
            fn: (e,widget,context,pluginUtils)=> {
                var fullPathFileName = pluginUtils.jQuery(e.currentTarget).val();
                var filename = fullPathFileName.split('\\').pop();

                pluginUtils.jQuery('input.uploadBlueprintFile').val(filename).attr('title',fullPathFileName);
            }
        },
        {
            selector: '.uploadForm',
            event: 'submit',
            fn: (e,widget,context,pluginUtils)=> {
                e.preventDefault();

                var formObj = pluginUtils.jQuery(e.currentTarget);

                // Clear errors
                formObj.find('.error:not(.message)').removeClass('error');
                formObj.find('.ui.error.message').hide();

                // Get the data
                var blueprintName = formObj.find("input[name='blueprintName']").val();
                var blueprintFileName = formObj.find("input[name='blueprintFileName']").val();
                var blueprintFileUrl = formObj.find("input[name='blueprintFileUrl']").val();
                var file = document.getElementById('blueprintFile').files[0];

                // Check that we have all we need
                if (_.isEmpty(blueprintFileUrl) && !file) {
                    formObj.addClass('error');
                    formObj.find("input.uploadBlueprintFile").parents('.field').addClass('error');
                    formObj.find("input[name='blueprintFileUrl']").parents('.field').addClass('error');
                    formObj.find('.ui.error.message').show();

                    return false;
                }

                if (_.isEmpty(blueprintName)) {
                    formObj.addClass('error');
                    formObj.find("input[name='blueprintName']").parents('.field').addClass('error');
                    formObj.find('.ui.error.message').show();

                    return false;
                }

                // Disalbe the form
                formObj.parents('.modal').find('.actions .button').attr('disabled','disabled').addClass('disabled loading');
                formObj.addClass('loading');

                // Call upload method
                var xhr = new XMLHttpRequest();
                (xhr.upload || xhr).addEventListener('progress', function(e) {
                    var done = e.position || e.loaded
                    var total = e.totalSize || e.total;
                    console.log('xhr progress: ' + Math.round(done/total*100) + '%');
                });
                xhr.addEventListener('load', function(e) {
                    console.log('xhr upload complete', e, this.responseText);
                    formObj.parents('.modal').modal('hide');
                    context.refresh();
                });
                xhr.open('put',context.getManagerUrl() +
                                '/api/v2.1/blueprints/'+blueprintName + (!_.isEmpty(blueprintFileName) ? '?application_file_name='+blueprintFileName+'.yaml' : ''));
                xhr.send(file);

                return false;
            }
        }
    ],

    render: function(widget,data,context,pluginUtils) {

        if (!widget.plugin.template) {
            return 'Blueprints: missing template';
        }

        if (_.isEmpty(data)) {
            return pluginUtils.renderLoading();
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
    },
    postRender: function(el,plugin,data,context,pluginUtils) {
        var modalObj = pluginUtils.jQuery(el).find('.uploadBlueprintModal');
        modalObj.modal({
                closable  : false,
                onDeny    : function(){
                    //window.alert('Wait not yet!');
                    //return false;
                },
                onApprove : function() {
                    pluginUtils.jQuery('.uploadForm').submit();
                    return false;
                }
            });
    }
});