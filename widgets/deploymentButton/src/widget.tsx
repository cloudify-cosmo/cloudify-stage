import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import DeploymentButton from './DeploymentButton';

const widgetId = 'deploymentButton';
const t = Stage.Utils.getT(`widgets.${widgetId}`);

type DeploymentButtonConfiguration = {
    toolbox: Stage.Types.Toolbox;
    basic: boolean;
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
};

Stage.defineWidget({
    id: 'deploymentButton',
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
            name: t('configuration.basic.name'),
            description: t('configuration.basic.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'color',
            name: t('configuration.color.name'),
            description: t('configuration.color.description'),
            default: 'green',
            component: Stage.Common.Components.SemanticColorDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'icon',
            name: t('configuration.icon.name'),
            description: t('configuration.icon.description'),
            default: 'rocket',
            component: Stage.Shared.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'label',
            name: t('configuration.label.name'),
            description: t('configuration.label.description'),
            default: t('configuration.label.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        }
    ],
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentButton'),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget: Stage.Types.Widget<DeploymentButtonConfiguration>, _data, _error, toolbox) {
        const { basic, color, icon, label } = widget.configuration;
        return <DeploymentButton toolbox={toolbox} basic={basic} color={color} icon={icon} label={label} />;
    }
});
