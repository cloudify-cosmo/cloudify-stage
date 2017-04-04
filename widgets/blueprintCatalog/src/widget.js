/**
 * Created by pposel on 06/02/2017.
 */

import RepositoryList from './RepositoryList';
import Actions from './actions';

const DEFUALT_IMAGE = "/widgets/blueprintCatalog/images/logo.png";

Stage.defineWidget({
    id: 'blueprintCatalog',
    name: "Blueprints catalog",
    description: 'Shows blueprints catalog',
    initialWidth: 8,
    initialHeight: 16,
    color: "teal",
    hasStyle: true,
    isReact: true,
    initialConfiguration: [
        Stage.GenericConfig.PAGE_SIZE_CONFIG(),
        {id: 'username', name: 'Fetch with username', placeHolder:"Type username", default:"cloudify-examples", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: 'filter', name: 'Optional blueprints filter', placeHolder:"Type filter for GitHub repositories", default:"blueprint in:name NOT local", type: Stage.Basic.GenericField.STRING_TYPE},
        {id: "displayStyle",name: "Display style", items: [{name:'Table', value:'table'}, {name:'Catalog', value:'catalog'}],
             default: "catalog", type: Stage.Basic.GenericField.LIST_TYPE},
        Stage.GenericConfig.SORT_COLUMN_CONFIG('created_at'),
        Stage.GenericConfig.SORT_ASCENDING_CONFIG(false)
    ],

    mapGridParams: function(gridParams) {
        return {
            page: gridParams.currentPage,
            per_page: gridParams.pageSize
        }
    },

    fetchData: function(widget, toolbox, params) {
        var actions = new Actions(toolbox, widget.configuration.username, widget.configuration.filter);

        return actions.doGetRepos(params).then(data => {
            var repos = data.items;
            var total = data.total_count;

            var fetches = _.map(repos, repo => actions.doFindImage(repo.name, DEFUALT_IMAGE)
                               .then(imageUrl=>Promise.resolve(Object.assign(repo, {image_url:imageUrl}))));
            return Promise.all(fetches).then((items)=>Promise.resolve({items, total}));
        });
    },

    render: function(widget, data, error, toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        var selectedCatalogId = toolbox.getContext().getValue("blueprintCatalogId");
        var formattedData = Object.assign({},data,{
            items: _.map (data.items,(item)=>{
                return Object.assign({},item,{
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    url: item.url,
                    created_at: Stage.Utils.formatTimestamp(item.created_at),
                    updated_at: Stage.Utils.formatTimestamp(item.updated_at),
                    image_url: item.image_url,
                    isSelected: selectedCatalogId === item.id
                })
            })
        });

        var actions = new Actions(toolbox, widget.configuration.username, widget.configuration.password);

        return (
            <RepositoryList widget={widget} data={formattedData} toolbox={toolbox} actions={actions}/>
        );
    }
});
