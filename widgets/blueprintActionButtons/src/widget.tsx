import BlueprintActionButtons from './BlueprintActionButtons';
import Consts from './consts';

export interface BlueprintActionButtonsConfiguration {
    showEditCopyInComposerButton: boolean;
}

const t = Stage.Utils.getT('widgets.blueprintActionButtons');

Stage.defineWidget<unknown, unknown, BlueprintActionButtonsConfiguration>({
    id: 'blueprintActionButtons',
    name: t('name'),
    description: t('description'),
    initialWidth: 3,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    initialConfiguration: [
        {
            id: 'showEditCopyInComposerButton',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: t('configuration.showEditCopyInComposerButton'),
            default: false
        }
    ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintActionButtons'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, _data, _error, toolbox) {
        const blueprintId = toolbox.getContext().getValue(Consts.CONTEXT_KEY.BLUEPRINT_ID);

        return (
            <BlueprintActionButtons
                blueprintId={blueprintId}
                toolbox={toolbox}
                showEditCopyInComposerButton={widget.configuration.showEditCopyInComposerButton}
            />
        );
    }
});
