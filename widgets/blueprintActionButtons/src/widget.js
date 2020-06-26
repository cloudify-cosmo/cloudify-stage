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
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintActionButtons'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, data, error, toolbox) {
        const blueprintId = toolbox.getContext().getValue('blueprintId');

        return <BlueprintActionButtons blueprintId={blueprintId} toolbox={toolbox} />;
    }
});
