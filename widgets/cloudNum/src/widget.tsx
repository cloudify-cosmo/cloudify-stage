import React from 'react';

const widgetId = 'cloudNum';
const t = Stage.Utils.getT('widgets.cloudNum');

Stage.defineWidget({
    id: widgetId,
    name: t('name'),
    description: t('description'),
    initialWidth: 2,
    initialHeight: 8,
    color: 'blue',
    showHeader: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION(widgetId),
    categories: [Stage.GenericConfig.CATEGORY.CHARTS_AND_STATISTICS],

    render() {
        const { KeyIndicator } = Stage.Basic;

        return <KeyIndicator icon="cloud" />;
    }
});
