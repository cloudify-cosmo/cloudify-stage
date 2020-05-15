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

    fetchUrl: '[manager]/blueprints?_include=main_file_name[params]',

    fetchParams(widget, toolbox) {
        return { id: toolbox.getContext().getValue('blueprintId') };
    },

    render(widget, data, error, toolbox) {
        const blueprintId = toolbox.getContext().getValue('blueprintId');
        const blueprintYamlFileName = _.get(data, 'items[0].main_file_name');

        return (
            <BlueprintActionButtons
                blueprintId={blueprintId}
                blueprintYamlFileName={blueprintYamlFileName}
                toolbox={toolbox}
            />
        );
    }
});
