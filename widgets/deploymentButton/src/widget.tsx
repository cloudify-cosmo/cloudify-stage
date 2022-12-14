import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { FilterRule } from '../../../app/widgets/common/filters/types';
import DeploymentButton from './DeploymentButton';

const widgetId = 'deploymentButton';
const t = Stage.Utils.getT(`widgets.${widgetId}`);
const tConfiguration = (suffix: string) => t(`configuration.${suffix}`);

type DeploymentButtonConfiguration = {
    toolbox: Stage.Types.Toolbox;
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    blueprintFilterRules: FilterRule[];
};

Stage.defineWidget({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 3,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    initialConfiguration: [
        {
            id: 'basic',
            name: tConfiguration('basic.name'),
            description: tConfiguration('basic.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'color',
            name: tConfiguration('color.name'),
            description: tConfiguration('color.description'),
            default: 'green',
            component: Stage.Common.Components.SemanticColorDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'icon',
            name: tConfiguration('icon.name'),
            description: tConfiguration('icon.description'),
            default: 'rocket',
            component: Stage.Shared.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'label',
            name: tConfiguration('label.name'),
            description: tConfiguration('label.description'),
            default: tConfiguration('label.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
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
