/**
 * Created by jakubniezgoda on 28/02/2017.
 */

import BlueprintActionButtons from './BlueprintActionButtons';

Stage.defineWidget({
    id: 'blueprintActionButtons',
    name: 'Blueprint action buttons',
    description: 'Provides set of action buttons for blueprint',
    initialWidth: 3,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    initialConfiguration: [],
    isReact: true,

    fetchData: function(widget,toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');

        if (!_.isEmpty(blueprintId)) {
            toolbox.loading(true);
            return toolbox.getManager().doGet(`/blueprints/${blueprintId}`)
                .then(blueprint => {
                    toolbox.loading(false);
                    return Promise.resolve(blueprint);
                });
        }

        return Promise.resolve(BlueprintActionButtons.EMPTY_BLUEPRINT);
    },

    fetchParams: function(widget, toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');

        return {blueprint_id: blueprintId};
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }


        return (
            <BlueprintActionButtons blueprint={data} widget={widget} toolbox={toolbox} />
        );
    }
});