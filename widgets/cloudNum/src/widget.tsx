import React from 'react';
import type { SemanticICONS } from 'semantic-ui-react';

const widgetId = 'cloudNum';
const translate = Stage.Utils.getT('widgets.cloudNum');

interface CloudNumWidgetConfiguration {
    icon: SemanticICONS;
    imageSrc: string;
}

Stage.defineWidget<unknown, unknown, CloudNumWidgetConfiguration>({
    id: widgetId,
    initialWidth: 2,
    initialHeight: 8,
    showHeader: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    initialConfiguration: [
        {
            id: 'icon',
            name: translate('configuration.icon.name'),
            description: translate('configuration.icon.description'),
            default: 'cloud',
            component: Stage.Shared.SemanticIconDropdown,
            type: Stage.Basic.GenericField.CUSTOM_TYPE
        },
        {
            id: 'imageSrc',
            name: translate('configuration.imageSrc.name'),
            description: translate('configuration.imageSrc.description'),
            default: '',
            type: Stage.Basic.GenericField.STRING_TYPE
        }
    ],

    render(widget) {
        const { KeyIndicator } = Stage.Basic;
        const { icon, imageSrc } = widget.configuration;

        return <KeyIndicator icon={icon} imageSrc={imageSrc} />;
    }
});
