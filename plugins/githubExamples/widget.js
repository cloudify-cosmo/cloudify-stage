/**
 * Created by kinneretzin on 07/09/2016.
 */

addPlugin({
    id: 'githubExamples',
    name: "Cloudify github examples",
    description: 'This plugin shows a list of cloudify example repositories',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    initialConfiguration: [
        {id: 'fetchUsername', name: 'Fetch with username' ,placeHolder:"Type username..", default:"cloudify-examples",fetch:true}
    ],
    fetchUrl: 'https://api.github.com/users/[config:fetchUsername]/repos',
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Inputs: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template,{items:data});

    }
});