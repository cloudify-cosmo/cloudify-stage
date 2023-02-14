import type { ButtonConfiguration } from 'app/widgets/common/configuration/buttonConfiguration';
import type { FilterRule } from 'app/widgets/common/filters/types';
import DeploymentButton from './DeploymentButton';

const widgetId = 'deploymentButton';
const t = Stage.Utils.getT(`widgets.${widgetId}`);
const tConfiguration = (suffix: string) => t(`configuration.${suffix}`);

interface DeploymentButtonConfiguration extends ButtonConfiguration {
    toolbox: Stage.Types.Toolbox;
    blueprintFilterRules: FilterRule[];
}

Stage.defineWidget({
    id: widgetId,
    initialWidth: 3,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    initialConfiguration: [
        ...Stage.Common.Configuration.Button.getInitialConfiguration({
            icon: 'rocket',
            label: tConfiguration('label.default')
        }),
        {
            id: 'blueprintFilterRules',
            name: tConfiguration('labelFilterRules.name'),
            default: [],
            type: Stage.Basic.GenericField.CUSTOM_TYPE,
            component: Stage.Common.Blueprints.LabelFilter
        }
    ],
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget: Stage.Types.Widget<DeploymentButtonConfiguration>, _data, _error, toolbox) {
        const { basic, color, icon, label, blueprintFilterRules } = widget.configuration;
        return (
            <DeploymentButton
                toolbox={toolbox}
                basic={basic}
                color={color}
                icon={icon}
                label={label}
                blueprintFilterRules={blueprintFilterRules}
            />
        );
    }
});
