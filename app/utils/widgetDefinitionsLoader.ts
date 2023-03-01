import 'd3';
import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';
import type {
    GetWidgetsResponse,
    PostWidgetsQueryParams,
    PostWidgetsResponse,
    PutWidgetsQueryParams,
    PutWidgetsResponse
} from 'backend/routes/Widgets.types';
import type { WidgetData } from 'backend/handler/WidgetsHandler.types';
import * as Basic from '../components/basic';
import * as Shared from '../components/shared';
import GenericConfig from './GenericConfig';
import * as Hooks from './hooks';
import Common from '../widgets/common';

import Internal from './Internal';
import LoaderUtils from './LoaderUtils';
import normalizeWidgetDefinition from './normalizeWidgetDefinition';
import * as PropTypes from './props';
import ScriptLoader from './scriptLoader';
import type { WidgetDefinition } from './StageAPI';
import StageUtils from './stageUtils';
import StyleLoader from './StyleLoader';
import type { ManagerData } from '../reducers/managerReducer';

let bundleLoadedWidgets: WidgetDefinition<any, any, any>[] = [];

function getBundleLoadedWidget(custom = true) {
    const [registeredWidget] = bundleLoadedWidgets;
    bundleLoadedWidgets = [];
    registeredWidget.isCustom = custom;
    return registeredWidget;
}

type WidgetListItem = Partial<WidgetData>;

export type SimpleWidgetDefinition = WidgetListItem & { loaded: boolean };

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

            Common,
            PropTypes,
            Hooks,
            i18n,
            styled
        };
        window.Stage = stageAPI;
    }

    private static loadWidgetBundle(widgetListItem: WidgetListItem, rejectOnError = true) {
        const scriptPath = `${LoaderUtils.getResourceUrl('widgets', widgetListItem.isCustom)}/${
            widgetListItem.id
        }/widget.js`;
        return new ScriptLoader(scriptPath).load(widgetListItem.id, rejectOnError);
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

    public static load(manager: ManagerData): Promise<SimpleWidgetDefinition[]> {
        const internal = new Internal(manager);
        return internal
            .doGet<GetWidgetsResponse>('/widgets')
            .then(widgets => widgets.map(widget => ({ ...widget, loaded: false })));
    }

    private static installWidget(widgetFile: File | null, widgetUrl: string, manager: ManagerData) {
        const internal = new Internal(manager);

        if (widgetUrl) {
            log.debug('Install widget from url', widgetUrl);
            return internal.doPost<PostWidgetsResponse, any, PostWidgetsQueryParams>('/widgets', {
                params: {
                    url: widgetUrl
                }
            });
        }
        log.debug('Install widget from file');
        return internal.doUpload<PostWidgetsResponse, PostWidgetsQueryParams>('/widgets', {
            method: 'post',
            files: { widget: widgetFile }
        });
    }

    private static updateWidget(
        widgetId: string,
        widgetFile: File | null,
        widgetUrl: string,
        manager: ManagerData
    ): Promise<WidgetListItem> {
        const internal = new Internal(manager);

        if (widgetUrl) {
            log.debug(`Update widget ${widgetId} from url`, widgetUrl);
            return internal.doPut<PutWidgetsResponse, any, PutWidgetsQueryParams>('/widgets', {
                params: { url: widgetUrl, id: widgetId }
            });
        }
        log.debug(`Update widget ${widgetId} from file`);
        return internal.doUpload<PutWidgetsResponse, PutWidgetsQueryParams>('/widgets', {
            params: { id: widgetId },
            files: { widget: widgetFile }
        });
    }

    private static validateWidget(widgetId: string, manager: ManagerData) {
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

    public static install(widgetFile: File | null, widgetUrl: string, manager: ManagerData) {
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

    public static update(widgetId: string, widgetFile: File | null, widgetUrl: string, manager: ManagerData) {
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

    public static uninstall(widgetId: string, manager: ManagerData) {
        const internal = new Internal(manager);
        return internal.doDelete(`/widgets/${widgetId}`);
    }
}
