import type { ButtonLinkProps } from '../../../app/widgets/common/components/ButtonLink';

type ButtonLinkWidgetConfiguration = ButtonLinkProps;

const widgetId = 'buttonLink';
const translate = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<unknown, unknown, ButtonLinkWidgetConfiguration>({
    id: widgetId,
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    initialConfiguration: [
        {
            id: 'url',
            name: translate('configuration.url.name'),
            description: translate('configuration.url.description'),
            default: translate('configuration.url.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'label',
            name: translate('configuration.label.name'),
            description: translate('configuration.label.description'),
            default: translate('configuration.label.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        ...Stage.Common.Configuration.Button.getInitialConfiguration(),
        {
            id: 'fullHeight',
            name: translate('configuration.fullHeight.name'),
            description: translate('configuration.fullHeight.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),

    render(widget) {
        const { ButtonLink } = Stage.Common.Components;
        const { basic, color, fullHeight, icon, label, url } = widget.configuration;

        return <ButtonLink basic={basic} color={color} label={label} icon={icon} fullHeight={fullHeight} url={url} />;
    }
});
