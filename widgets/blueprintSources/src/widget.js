/**
 * Created by kinneretzin on 07/09/2016.
 */

import Actions from './actions';
import BlueprintSources from './BlueprintSources';

Stage.defineWidget({
    id: "blueprintSources",
    name: "Blueprint Sources",
    description: 'Shows blueprint files',
    initialWidth: 8,
    initialHeight: 20,
    color : "orange",
    isReact: true,
    hasStyle: true,
    initialConfiguration: [
        {id: "contentPaneWidth", name: "Content pane initial width in %", default: 65, type: Stage.Basic.GenericField.NUMBER_TYPE}
    ],

    fetchParams: function(widget, toolbox) {
        var blueprintId = toolbox.getContext().getValue('blueprintId');
        return {
            blueprint_id: blueprintId
        }
    },

    fetchData: function(widget, toolbox, params) {
        var blueprintId = params.blueprint_id;

        if (blueprintId) {
            var actions = new Actions(toolbox);
            return actions.doGetBlueprintDetails(blueprintId).then(data => {
                var lastUpdate = moment(data.updated_at, 'YYYY-MM-DD HH:mm:ss.SSSSS').format('DDMMYYYYHHmm');
                return actions.doGetFilesTree(blueprintId, lastUpdate).then(tree => {
                    return {tree, blueprintId}
                });
            });
        } else {
            return Promise.resolve({tree:{}});
        }
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        return (
            <div>
                <BlueprintSources widget={widget} data={data} toolbox={toolbox}/>
            </div>
        );
    }
});