/**
 * Created by kinneretzin on 20/10/2016.
 */

import GithubRepositoriesTable from './GithubRepositoriesTable';

Stage.defineWidget({
    id: 'githubRepositories',
    name: "GitHub repositories list",
    description: 'This widget shows a users\'s repositories',
    initialWidth: 8,
    initialHeight: 4,
    color: "teal",
    isReact: true,
    initialConfiguration: [
        {id: 'fetchUsername', name: 'Fetch with username', placeHolder:"Type username", default:"cloudify-examples",
            fetch:true, type: Stage.Basic.GenericField.STRING_TYPE}
    ],
    fetchUrl: 'https://api.github.com/users/[config:fetchUsername]/repos',
    render: function(widget,data,error,toolbox) {

        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var formattedData = Object.assign({},data);

        formattedData = Object.assign({},formattedData,{
            items: _.map (formattedData,(item)=>{
                return Object.assign({},item,{
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    url: item.url
                })
            })
        });

        return (
            <GithubRepositoriesTable widget={widget} data={formattedData} context={toolbox}/>
        );
    }
});
