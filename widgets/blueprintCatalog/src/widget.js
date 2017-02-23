/**
 * Created by pposel on 06/02/2017.
 */

import RepositoryList from './RepositoryList';
import Actions from './actions';

const BLUEPRINT_IMAGE_FILENAME = "blueprint.png";
const GITHUB_BLUEPRINT_IMAGE_URL = (user,repo)=>`https://raw.githubusercontent.com/${user}/${repo}/master/${BLUEPRINT_IMAGE_FILENAME}`;
const DEFUALT_IMAGE = "/widgets/blueprintCatalog/images/Cloudify-logo.png"

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
        {id: 'password', name: 'Optional password', placeHolder:"Type password", default:"", type: Stage.Basic.GenericField.PASSWORD_TYPE},
        {id: "displayStyle",name: "Display style", items: [{name:'Table', value:'table'}, {name:'Catalog', value:'catalog'}],
             default: "catalog", type: Stage.Basic.GenericField.LIST_TYPE}

    ],

    mapGridParams: function(gridParams) {
        return {
            page: gridParams.currentPage,
            per_page: gridParams.pageSize
        }
    },

    fetchData: function(widget, toolbox, params) {
        var actions = new Actions(toolbox, widget.configuration.username, widget.configuration.password);

        return actions.doGetRepos(params).then(repos => {
            var fetches = _.map(repos,
                repo => actions.doGetRepoTree(repo.name)
                               .then(tree => { return _.findIndex(tree.tree, {"path":BLUEPRINT_IMAGE_FILENAME})<0?
                                               Promise.resolve(Object.assign(repo, {image_url:DEFUALT_IMAGE})):
                                               Promise.resolve(Object.assign(repo, {image_url:GITHUB_BLUEPRINT_IMAGE_URL(actions.getUsername(), repo.name)}))}));
            return Promise.all(fetches).then((data)=>Promise.resolve({items:data}));
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
                    created_at: moment(item.created_at,'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm'),
                    updated_at: moment(item.updated_at,'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm'),
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
