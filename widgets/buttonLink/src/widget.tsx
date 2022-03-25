import ButtonLink, { ButtonLinkProps } from './ButtonLink';

type ButtonLinkWidgetConfiguration = ButtonLinkProps;

const widgetId = 'buttonLink';
const t = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<unknown, unknown, ButtonLinkWidgetConfiguration>({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    initialConfiguration: [
        {
            id: 'url',
            name: t('configuration.url.name'),
            description: t('configuration.url.description'),
            default: t('configuration.url.default'),
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
            id: 'color',
            name: t('configuration.color.name'),
            description: t('configuration.color.description'),
            default: t('configuration.color.default'),
            component: Stage.Common.Components.SemanticColorDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
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
            id: 'basic',
            name: t('configuration.basic.name'),
            description: t('configuration.basic.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        },
        {
            id: 'fullHeight',
            name: t('configuration.fullHeight.name'),
            description: t('configuration.fullHeight.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),

    render(widget) {
        const { basic, color, fullHeight, icon, label, url } = widget.configuration;

        return <ButtonLink basic={basic} color={color} label={label} icon={icon} fullHeight={fullHeight} url={url} />;
    }
});
