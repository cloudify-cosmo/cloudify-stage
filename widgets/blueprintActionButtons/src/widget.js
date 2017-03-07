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

    render: function(widget,data,error,toolbox) {
        let blueprintId = toolbox.getContext().getValue('blueprintId');
        return (
            <BlueprintActionButtons blueprintId={blueprintId} widget={widget} toolbox={toolbox} />
        );
    }
});