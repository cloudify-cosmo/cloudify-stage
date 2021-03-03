import log from 'loglevel';

import GenericConfig from './GenericConfig';
import { WidgetDefinition, WidgetDefinitionForDefining } from './StageAPI';

export default function normalizeWidgetDefinition<Params, Data, Configuration>(
    initialDefinition: WidgetDefinitionForDefining<Params, Data, Configuration>
): WidgetDefinition<Params, Data, Configuration> {
    const id = initialDefinition.id ?? document.currentScript?.id;
    if (!initialDefinition.name) {
        log.error('Missing widget name. Widget data is :', initialDefinition);
    }
    if (!id) {
        log.error('Missing widget id. Widget data is :', initialDefinition);
    }

    return {
        // Set default values for optional properties
        color: 'blue',
        categories: [GenericConfig.CATEGORY.OTHERS],
        hasReadme: false,
        hasStyle: false,
        hasTemplate: false,
        initialConfiguration: [],
        initialHeight: 12,
        initialWidth: 3,
        isReact: true,
        permission: GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
        showBorder: true,
        showHeader: true,
        // By default don't check the supported editions and keep backwards compatibility
        supportedEditions: [],

        ...initialDefinition,
        id
    };
}
