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
    initialConfiguration: {filterBy: {title: "Filter by", icon:"search", placeHolder: "Specify name to filter with...", default: ""}, fetchUsername: {title: "Fetch with username:", placeHolder:"Type username..", default:"cloudify-examples"} , hostname:{title:"Hostname", placeHolder: "Hostname you'd like to use", default:"https://cloudify.com"}},
    fetchUrl: 'https://api.github.com/search/repositories?q=-nfv+in:name+fork:true+user:',
    render: function(widget,data,error,context,pluginUtils) {
        if (!widget.plugin.template) {
            return 'Inputs: missing template';
        }

        return pluginUtils.buildFromTemplate(widget.plugin.template,data);

    }
});