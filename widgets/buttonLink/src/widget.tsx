import type { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react';
import type { CSSProperties } from 'react';

interface ButtonLinkWidgetConfiguration {
    color: SemanticCOLORS;
    icon: SemanticICONS;
    label: string;
    url: string;
    fullHeight: boolean;
}

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
            component: Stage.Common.SemanticColorDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'icon',
            name: t('configuration.icon.name'),
            description: t('configuration.icon.description'),
            default: t('configuration.icon.default'),
            component: Stage.Common.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'url',
            name: t('configuration.url.name'),
            description: t('configuration.url.description'),
            default: t('configuration.url.default'),
            type: Stage.Basic.GenericField.STRING_TYPE
        },
        {
            id: 'fullHeight',
            name: t('configuration.fullHeight.name'),
            description: t('configuration.fullHeight.description'),
            default: false,
            type: Stage.Basic.GenericField.BOOLEAN_TYPE
        }
    ],
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),

    render(widget) {
        const { Button } = Stage.Basic;
        const { color, fullHeight, icon, label, url } = widget.configuration;

        const style: CSSProperties = {};
        if (fullHeight) {
            style.height = 'calc(100% + 14px)';
        }

        return (
            <Button
                disabled={!url}
                color={color}
                content={label}
                icon={icon}
                fluid
                labelPosition={icon ? 'left' : undefined}
                onClick={() => window.open(url, '_blank')}
                style={style}
            />
        );
    }
});
