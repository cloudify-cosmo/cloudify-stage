import type { ServiceButtonProps } from './ServiceButton';
import ServiceButton from './ServiceButton';

type ServiceButtonWidgetConfiguration = ServiceButtonProps;

const widgetId = 'serviceButton';
const t = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<unknown, undefined, ServiceButtonWidgetConfiguration>({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 2,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    initialConfiguration: [
        {
            id: 'color',
            name: t('configuration.color.name'),
            description: t('configuration.color.description'),
            default: undefined,
            component: Stage.Common.Components.SemanticColorDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'label',
            name: t('configuration.label.name'),
            description: t('configuration.label.description'),
            default: t('configuration.label.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'icon',
            name: t('configuration.icon.name'),
            description: t('configuration.icon.description'),
            default: t('configuration.icon.default'),
            component: Stage.Shared.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'defaultMarketplaceTab',
            name: t('configuration.defaultMarketplaceTab.name'),
            description: t('configuration.defaultMarketplaceTab.description'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'basic',
            name: t('configuration.basic.name'),
            description: t('configuration.basic.description'),
            default: true,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],

    render(widget, _data, _error, toolbox) {
        const { color, icon, basic, label, defaultMarketplaceTab } = widget.configuration;

        return (
            <ServiceButton
                basic={basic}
                color={color}
                icon={icon}
                label={label}
                defaultMarketplaceTab={defaultMarketplaceTab}
                toolbox={toolbox}
            />
        );
    }
});
