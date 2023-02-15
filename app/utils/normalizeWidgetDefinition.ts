import log from 'loglevel';

import StageUtils from './stageUtils';
import GenericConfig from './GenericConfig';
import type { InitialWidgetDefinition, WidgetDefinition } from './StageAPI';

export default function normalizeWidgetDefinition<Params, Data, Configuration>(
    initialDefinition: InitialWidgetDefinition<Params, Data, Configuration>
): WidgetDefinition<Params, Data, Configuration> {
    // TODO(RD-1604): take ID from initialDefinition into account
    const id = document.currentScript?.id ?? '';
    if (!id) {
        log.error('Missing widget id. Widget data is :', initialDefinition);
    }

    const translate = StageUtils.getT(`widgets.${initialDefinition.id}`);

    return {
        // Set default values for optional properties
        categories: [GenericConfig.CATEGORY.OTHERS],
        hasReadme: false,
        hasStyle: false,
        hasTemplate: false,
        initialConfiguration: [],
        initialHeight: 12,
        initialWidth: 3,
        isReact: true,
        loaded: true,
        permission: GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
        showBorder: true,
        showHeader: true,
        // By default don't check the supported editions and keep backwards compatibility
        supportedEditions: [],
        name: translate('name'),
        description: translate('description', '') || undefined,

        ...initialDefinition,
        id
    };
}
