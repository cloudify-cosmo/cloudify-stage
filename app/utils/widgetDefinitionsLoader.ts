import 'd3';
import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';
import * as Basic from '../components/basic';
import * as Shared from '../components/shared';
import GenericConfig from './GenericConfig';
import * as Hooks from './hooks';

import Internal from './Internal';
import LoaderUtils from './LoaderUtils';
import normalizeWidgetDefinition from './normalizeWidgetDefinition';
import * as PropTypes from './props';
import ScriptLoader from './scriptLoader';
import type { WidgetDefinition } from './StageAPI';
import StageUtils from './stageUtils';
import StyleLoader from './StyleLoader';

let bundleLoadedWidgets: WidgetDefinition<any, any, any>[] = [];

function getBundleLoadedWidget(custom = true) {
    const [registeredWidget] = bundleLoadedWidgets;
    bundleLoadedWidgets = [];
    registeredWidget.isCustom = custom;
    return registeredWidget;
}

interface WidgetListItem {
    id: string;
    isCustom: boolean;
}

export default class WidgetDefinitionsLoader {
    public static init() {
        const stageAPI: typeof Stage = {
            defineWidget: widgetDefinition => {
                bundleLoadedWidgets.push(normalizeWidgetDefinition(widgetDefinition));
            },
            Basic,
            Shared,
            ComponentToHtmlString: renderToString,
            GenericConfig,
            Utils: StageUtils,

            Common: {},
            defineCommon: def => {
                window.Stage.Common = def;
            },

            PropTypes,
            definePropTypes: def => {
                Object.assign(window.Stage.PropTypes, def);
            },

            Hooks,
            defineHooks: def => {
                Object.assign(window.Stage.Hooks, def);
            },

            i18n,
            styled
        };
        window.Stage = stageAPI;
    }

    private static loadWidgetBundle(widget: WidgetListItem, rejectOnError = true) {
        const scriptPath = `${LoaderUtils.getResourceUrl('widgets', widget.isCustom)}/${widget.id}/widget.js`;
        return new ScriptLoader(scriptPath).load(widget.id, rejectOnError);
    }

    public static loadWidget(widgetListItem: WidgetListItem) {
        return WidgetDefinitionsLoader.loadWidgetBundle(widgetListItem, false)
            .then(() => getBundleLoadedWidget(widgetListItem.isCustom))
            .then(WidgetDefinitionsLoader.loadWidgetResources)
            .then(WidgetDefinitionsLoader.initWidget)
            .catch(e => {
                log.error(e);
            });
    }

    private static loadWidgetResources(widgetDefinition: WidgetDefinition<any, any, any>) {
        const promises: Promise<any>[] = [];

        if (widgetDefinition.hasTemplate) {
            promises.push(
                LoaderUtils.fetchResource(`widgets/${widgetDefinition.id}/widget.html`, widgetDefinition.isCustom).then(
                    (widgetHtml: any) => {
                        if (widgetHtml) {
                            widgetDefinition.template = widgetHtml;
                        }
                    }
                )
            );
        }
        if (widgetDefinition.hasStyle) {
            promises.push(
                new StyleLoader(
                    LoaderUtils.getResourceUrl(`widgets/${widgetDefinition.id}/widget.css`, widgetDefinition.isCustom)
                ).load()
            );
        }

        return Promise.all(promises).then(() => widgetDefinition);
    }

    private static initWidget(widgetDefinition: WidgetDefinition<any, any, any>) {
        if (widgetDefinition.init && typeof widgetDefinition.init === 'function') {
            widgetDefinition.init();
        }

        return widgetDefinition;
    }

    public static load(manager: any): Promise<WidgetDefinition<any, any, any>[]> {
        const internal = new Internal(manager);
        return Promise.all([
            new ScriptLoader(LoaderUtils.getResourceUrl('widgets/common/common.js', false)).load(), // Commons has to load before the widgets
            internal.doGet('/widgets/list') // We can load the list of widgets in the meanwhile
        ]).then(results => results[1].map((widget: WidgetListItem) => ({ ...widget, loaded: false })));
    }

    private static installWidget(widgetFile: any, widgetUrl: any, manager: any) {
        const internal = new Internal(manager);

        if (widgetUrl) {
            log.debug('Install widget from url', widgetUrl);
            return internal.doPut('/widgets/install', {
                params: {
                    url: widgetUrl
                }
            });
        }
        log.debug('Install widget from file');
        return internal.doUpload('/widgets/install', { files: { widget: widgetFile } });
    }

    private static updateWidget(widgetId: any, widgetFile: any, widgetUrl: any, manager: any): Promise<WidgetListItem> {
        const internal = new Internal(manager);

        if (widgetUrl) {
            log.debug(`Update widget ${widgetId} from url`, widgetUrl);
            return internal.doPut('/widgets/update', { params: { url: widgetUrl, id: widgetId } });
        }
        log.debug(`Update widget ${widgetId} from file`);
        return internal.doUpload('/widgets/update', { params: { id: widgetId }, files: { widget: widgetFile } });
    }

    private static validateWidget(widgetId: any, manager: any) {
        const errors = [];

        if (_.isEmpty(bundleLoadedWidgets)) {
            errors.push(
                i18n.t(
                    'widget.validationErrors.noWidgetDefinition',
                    'Widget not properly initialized. Please check if widget.js is correctly defined.'
                )
            );
        } else if (bundleLoadedWidgets.length > 1) {
            errors.push(
                i18n.t(
                    'widget.validationErrors.multipleDefinitions',
                    'Only single widget should be defined within widget.js'
                )
            );
        } else {
            const widgetDefinition = bundleLoadedWidgets[0];

            if (!_.includes(_.keys(manager.permissions), widgetDefinition.permission)) {
                errors.push(
                    i18n.t(
                        'widget.validationErrors.invalidPermission',
                        `Specified widget permission ('{{permission}}') not found in available permissions list.`,
                        _.pick(widgetDefinition, 'permission')
                    )
                );
            }

            if (_.isEmpty(widgetDefinition.id)) {
                errors.push(
                    i18n.t(
                        'widget.validationErrors.idNotSpecified',
                        "Mandatory field - 'id' - not specified in widget definition."
                    )
                );
            }

            if (_.isEmpty(widgetDefinition.name)) {
                errors.push(
                    i18n.t(
                        'widget.validationErrors.nameNotSpecified',
                        "Mandatory field - 'name' - not specified in widget definition."
                    )
                );
            }
        }

        if (!_.isEmpty(errors)) {
            const errorMessage =
                errors.length > 1
                    ? i18n.t('widget.validationErrors.multipleErrors', `Multiple errors occured: {{}}`, {
                          errors: _.join(errors, ' ')
                      })
                    : errors[0];

            bundleLoadedWidgets = [];

            return WidgetDefinitionsLoader.uninstall(widgetId, manager).then(() => {
                throw new Error(errorMessage);
            });
        }

        return Promise.resolve();
    }

    public static install(widgetFile: any, widgetUrl: any, manager: any) {
        let widgetData: any = {};

        return WidgetDefinitionsLoader.installWidget(widgetFile, widgetUrl, manager)
            .then(data => {
                widgetData = data;
                return WidgetDefinitionsLoader.loadWidgetBundle(data);
            })
            .then(() => WidgetDefinitionsLoader.validateWidget(widgetData.id, manager))
            .then(() => getBundleLoadedWidget())
            .then(WidgetDefinitionsLoader.loadWidgetResources)
            .then(WidgetDefinitionsLoader.initWidget)
            .catch(err => {
                log.error(err);
                throw err;
            });
    }

    public static update(widgetId: any, widgetFile: any, widgetUrl: any, manager: any) {
        const widgetData: any = {};

        return WidgetDefinitionsLoader.updateWidget(widgetId, widgetFile, widgetUrl, manager)
            .then(WidgetDefinitionsLoader.loadWidgetBundle)
            .then(() => WidgetDefinitionsLoader.validateWidget(widgetData.id, manager))
            .then(() => getBundleLoadedWidget())
            .then(WidgetDefinitionsLoader.loadWidgetResources)
            .then(WidgetDefinitionsLoader.initWidget)
            .catch(err => {
                log.error(err);
                throw err;
            });
    }

    public static uninstall(widgetId: any, manager: any) {
        const internal = new Internal(manager);
        return internal.doDelete(`/widgets/${widgetId}`);
    }
}
