import BlueprintActionButtons from './BlueprintActionButtons';

export interface BlueprintActionButtonsConfiguration {
    showEditCopyInComposerButton: boolean;
}

Stage.defineWidget<unknown, unknown, BlueprintActionButtonsConfiguration>({
    id: 'blueprintActionButtons',
    name: 'Blueprint action buttons',
    description: 'Provides set of action buttons for blueprint',
    initialWidth: 3,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    initialConfiguration: [
        {
            id: 'showEditCopyInComposerButton',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: Stage.i18n.t('widgets.blueprintActionButtons.configuration.showEditCopyInComposerButton'),
            default: false
        }
    ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintActionButtons'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, _data, _error, toolbox) {
        const blueprintId = toolbox.getContext().getValue('blueprintId');
        const {
            configuration: { showEditCopyInComposerButton }
        } = widget;

        return (
            <BlueprintActionButtons
                blueprintId={blueprintId}
                toolbox={toolbox}
                showEditCopyInComposerButton={showEditCopyInComposerButton}
            />
        );
    }
});
