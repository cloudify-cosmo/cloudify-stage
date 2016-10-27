/**
 * Created by kinneretzin on 20/10/2016.
 */

import GithubExamplesTable from './GithubExamplesTable';

Stage.addPlugin({
    id: 'githubExamples',
    name: "Cloudify github examples",
    description: 'This plugin shows a list of cloudify example repositories',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    isReact: true,
    initialConfiguration: [
        {id: 'fetchUsername', name: 'Fetch with username' ,placeHolder:"Type username..", default:"cloudify-examples",fetch:true}
    ],
    fetchUrl: 'https://api.github.com/users/[config:fetchUsername]/repos',
    render: function(widget,data,error,context,pluginUtils) {

        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var formattedData = Object.assign({},data);

        var exampleId = context.getValue('id');
        var selectedExample = context.getValue('id');

        if (exampleId) {
            formattedData.items = _.filter(data.items,{example_name:exampleName});
        }

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData.items,(item)=>{
                return Object.assign({},item,{
                    isSelected: item.id === selectedExample
                })
            })
        });

        return (
            <GithubExamplesTable widget={widget} data={formattedData} context={context} utils={pluginUtils}/>
        );
    }
});
