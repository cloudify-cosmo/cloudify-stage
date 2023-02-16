import type { ServiceButtonProps } from './ServiceButton';
import ServiceButton from './ServiceButton';

type ServiceButtonWidgetConfiguration = ServiceButtonProps;

const widgetId = 'serviceButton';
const t = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<unknown, undefined, ServiceButtonWidgetConfiguration>({
    id: widgetId,
    initialWidth: 2,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.DEPLOYMENTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    initialConfiguration: [
        ...Stage.Common.Configuration.Button.getInitialConfiguration({
            icon: 'add',
            label: t('configuration.label.default')
        }),
        {
            id: 'defaultMarketplaceTab',
            name: t('configuration.defaultMarketplaceTab.name'),
            description: t('configuration.defaultMarketplaceTab.description'),
            type: Stage.Basic.GenericField.STRING_TYPE
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
