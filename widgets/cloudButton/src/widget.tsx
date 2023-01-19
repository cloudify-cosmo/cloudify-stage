import type { ButtonLinkProps } from '../../../app/widgets/common/components/ButtonLink';

const widgetId = 'cloudButton';
const translate = Stage.Utils.getT(`widgets.${widgetId}`);

Stage.defineWidget<unknown, unknown, Omit<ButtonLinkProps, 'fullHeight' | 'url'>>({
    id: widgetId,
    name: translate('name'),
    description: translate('description'),
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    initialConfiguration: [
        ...Stage.Common.Configuration.Button.getInitialConfiguration({
            icon: 'wizard',
            label: translate('configuration.label.default')
        })
    ],
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),

    render(widget) {
        const { ButtonLink } = Stage.Common.Components;
        const { basic, color, icon, label } = widget.configuration;

        return (
            <ButtonLink
                basic={basic}
                color={color}
                label={label}
                icon={icon}
                fullHeight={false}
                url="?cloudSetup=true"
            />
        );
    }
});
