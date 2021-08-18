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
            description: (
                <>
                    {t('configuration.color.description.text')}{' '}
                    <a href={t('configuration.color.description.linkUrl')}>
                        {t('configuration.color.description.linkTitle')}
                    </a>
                </>
            ),
            default: t('configuration.color.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
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
            description: (
                <>
                    {t('configuration.icon.description.text')}{' '}
                    <a href={t('configuration.icon.description.linkUrl')}>
                        {t('configuration.icon.description.linkTitle')}
                    </a>
                </>
            ),
            default: t('configuration.icon.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        Stage.Common.BlueprintMarketplace.tabsConfig
    ],

    render(widget) {
        const { color, icon, label, marketplaceTabs } = widget.configuration;

        return <ServiceButton color={color} icon={icon} label={label} marketplaceTabs={marketplaceTabs} />;
    }
});
