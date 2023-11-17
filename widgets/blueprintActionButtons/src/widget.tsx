import BlueprintActionButtons from './BlueprintActionButtons';
import Consts from './consts';
import Utils from './utils';

export interface BlueprintActionButtonsConfiguration {
    showEditCopyInComposerButton: boolean;
}

const translate = Utils.getWidgetTranslation();

Stage.defineWidget<unknown, unknown, BlueprintActionButtonsConfiguration>({
    id: Consts.WIDGET_ID,
    initialWidth: 3,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    initialConfiguration: [
        {
            id: 'showEditCopyInComposerButton',
            type: Stage.Basic.GenericField.BOOLEAN_TYPE,
            name: translate('configuration.showEditCopyInComposerButton'),
            default: true
        }
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(Consts.WIDGET_ID),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, _data, _error, toolbox) {
        const blueprintId = toolbox.getContext().getValue(Consts.CONTEXT_KEY.BLUEPRINT_ID);
        const openDeploymentModal = toolbox.getContext().getValue(Consts.CONTEXT_KEY.OPEN_DEPLOYMENT_MODAL);

        return (
            <BlueprintActionButtons
                blueprintId={blueprintId}
                toolbox={toolbox}
                showEditCopyInComposerButton={widget.configuration.showEditCopyInComposerButton}
                openDeploymentModal={openDeploymentModal}
            />
        );
    }
});
