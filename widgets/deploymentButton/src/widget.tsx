import DeploymentButton from './DeploymentButton';
import type { DeploymentButtonWidget } from './widget.types';

const widgetId = 'deploymentButton';
const translateConfiguration = Stage.Utils.getT(`widgets.${widgetId}.configuration`);
const SearchActions = Stage.Common.Actions.Search;

Stage.defineWidget<unknown, DeploymentButtonWidget.Data, DeploymentButtonWidget.Configuration>({
    id: widgetId,
    initialWidth: 3,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    initialConfiguration: [
        ...Stage.Common.Configuration.Button.getInitialConfiguration({
            icon: 'rocket',
            label: translateConfiguration('label.default')
        }),
        {
            id: 'blueprintFilterRules',
            name: translateConfiguration('labelFilterRules.name'),
            default: [],
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Common.Blueprints.LabelFilter
        }
    ],
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    fetchData(widget, toolbox) {
        const searchActions = new SearchActions(toolbox);
        return searchActions.doListBlueprints(widget.configuration.blueprintFilterRules, {
            _include: 'id',
            _size: 1
        });
    },

    render(widget, data, _error, toolbox) {
        const { basic, color, icon, label, blueprintFilterRules } = widget.configuration;
        const disableDeploymentButton = data?.items?.length === 0;

        return (
            <DeploymentButton
                toolbox={toolbox}
                basic={basic}
                color={color}
                icon={icon}
                label={label}
                blueprintFilterRules={blueprintFilterRules}
                disabled={disableDeploymentButton}
            />
        );
    }
});
