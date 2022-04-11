// @ts-nocheck File not migrated fully to TS
import i18n from 'i18next';
import _ from 'lodash';
import log from 'loglevel';
import { renderToString } from 'react-dom/server';
import styled from 'styled-components';
import 'd3';

import Internal from './Internal';
import ScriptLoader from './scriptLoader';
import StyleLoader from './StyleLoader';
import * as Basic from '../components/basic';
import * as Shared from '../components/shared';
import StageUtils from './stageUtils';
import LoaderUtils from './LoaderUtils';
import GenericConfig from './GenericConfig';
import * as PropTypes from './props';
import * as Hooks from './hooks';
import type { WidgetDefinition } from './StageAPI';
import normalizeWidgetDefinition from './normalizeWidgetDefinition';

let widgetDefinitions: WidgetDefinition<any, any, any>[] = [];

function updateReadmeLinks(content: any) {
    const linkRegex = /(\[.*?\])\(\s*(?!http)(.*?)\s*\)/gm;
    const anchorHrefRegex = /<a href="([^#]*?)">/gm;

    const newContent = content
        .replace(anchorHrefRegex, `<a href="${i18n.t('widgets.common.readmes.linksBasePath')}$1">`)
        .replace(linkRegex, `$1(${i18n.t('widgets.common.readmes.linksBasePath')}$2)`);

    return newContent;
}

function convertReadmeParams(content: any) {
    const paramRegex = /{{<\s*param\s*(\S*)\s*>}}/gm;
    let newContent = content;

    Array.from(newContent.matchAll(paramRegex)).forEach((match: any) => {
        const paramName = match[1];
        const paramValue = i18n.t(`widgets.common.readmes.params.${paramName}`);
        if (paramValue !== undefined) {
            newContent = newContent.replace(match[0], paramValue);
        }
    });

    return newContent;
}

export default class WidgetDefinitionsLoader {
    public static init() {
        const stageAPI: typeof Stage = {
            defineWidget: widgetDefinition => {
                widgetDefinitions.push(normalizeWidgetDefinition(widgetDefinition));
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

    private static loadWidgets(manager: any) {
        log.debug('Load widgets');

        const internal = new Internal(manager);
        return Promise.all([
            new ScriptLoader(LoaderUtils.getResourceUrl('widgets/common/common.js', false)).load(), // Commons has to load before the widgets
            internal.doGet('/widgets/list') // We can load the list of widgets in the meanwhile
        ]).then(results => {
            const data: any[] = results[1]; // widgets data
            const promises: Promise<any>[] = [];
            data.forEach(item => {
                promises.push(WidgetDefinitionsLoader.loadWidget(item, false));
            });

            const output = _.keyBy(data, 'id');
            return Promise.all(promises).then(() => output);
        });
    }

    private static loadWidget(widget: any, rejectOnError: any) {
        const scriptPath = `${LoaderUtils.getResourceUrl('widgets', widget.isCustom)}/${widget.id}/widget.js`;
        return new ScriptLoader(scriptPath).load(widget.id, rejectOnError);
    }

    private static loadWidgetsResources(widgets: any) {
        log.debug('Load widgets resources');

        const promises: Promise<any>[] = [];
        widgetDefinitions.forEach(widgetDefinition => {
            // Mark system widgets to protect against uninstalling
            widgetDefinition.isCustom = widgets[widgetDefinition.id].isCustom;

            if (widgetDefinition.hasTemplate) {
                promises.push(
                    LoaderUtils.fetchResource(
                        `widgets/${widgetDefinition.id}/widget.html`,
                        widgetDefinition.isCustom
                    ).then((widgetHtml: any) => {
                        if (widgetHtml) {
                            widgetDefinition.template = widgetHtml;
                        }
                    })
                );
            }
            if (widgetDefinition.hasStyle) {
                promises.push(
                    new StyleLoader(
                        LoaderUtils.getResourceUrl(
                            `widgets/${widgetDefinition.id}/widget.css`,
                            widgetDefinition.isCustom
                        )
                    ).load()
                );
            }

            if (widgetDefinition.hasReadme) {
                promises.push(
                    LoaderUtils.fetchResource(
                        `widgets/${widgetDefinition.id}/README.md`,
                        widgetDefinition.isCustom
                    ).then((widgetReadme: any) => {
                        if (widgetReadme) {
                            widgetDefinition.readme = widgetDefinition.isCustom
                                ? widgetReadme
                                : updateReadmeLinks(convertReadmeParams(widgetReadme));
                        }
                    })
                );
            }
        });

        return Promise.all(promises);
    }

    private static initWidgets() {
        log.debug('Init widgets');

        _.each(widgetDefinitions, w => {
            if (w.init && typeof w.init === 'function') {
                w.init();
            }
        });

        const loadedWidgetDefinitions = _.sortBy(widgetDefinitions, ['name']);
        widgetDefinitions = []; // Clear for next time

        return Promise.resolve(loadedWidgetDefinitions);
    }

    public static load(manager: any): Promise<WidgetDefinition<any, any, any>[]> {
        return WidgetDefinitionsLoader.loadWidgets(manager)
            .then(widgets => WidgetDefinitionsLoader.loadWidgetsResources(widgets))
            .then(() => WidgetDefinitionsLoader.initWidgets())
            .catch(e => {
                log.error(e);
                widgetDefinitions = []; // Clear for next time

                return Promise.resolve([]);
            });
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

    private static updateWidget(widgetId: any, widgetFile: any, widgetUrl: any, manager: any) {
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

        if (_.isEmpty(widgetDefinitions)) {
            errors.push(
                i18n.t(
                    'widget.validationErrors.noWidgetDefinition',
                    'Widget not properly initialized. Please check if widget.js is correctly defined.'
                )
            );
        } else if (widgetDefinitions.length > 1) {
            errors.push(
                i18n.t(
                    'widget.validationErrors.multipleDefinitions',
                    'Only single widget should be defined within widget.js'
                )
            );
        } else {
            const widgetDefinition = widgetDefinitions[0];

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
                return WidgetDefinitionsLoader.loadWidget(data, true);
            })
            .then(() => WidgetDefinitionsLoader.validateWidget(widgetData.id, manager))
            .then(() => WidgetDefinitionsLoader.loadWidgetsResources(_.keyBy([widgetData], 'id')))
            .then(() => WidgetDefinitionsLoader.initWidgets())
            .catch(err => {
                widgetDefinitions = []; // Clear for next time
                log.error(err);
                throw err;
            });
    }

    public static update(widgetId: any, widgetFile: any, widgetUrl: any, manager: any) {
        let widgetData: any = {};

        return WidgetDefinitionsLoader.updateWidget(widgetId, widgetFile, widgetUrl, manager)
            .then(data => {
                widgetData = data;
                return WidgetDefinitionsLoader.loadWidget(data, true);
            })
            .then(() => WidgetDefinitionsLoader.validateWidget(widgetData.id, manager))
            .then(() => WidgetDefinitionsLoader.loadWidgetsResources(_.keyBy([widgetData], 'id')))
            .then(() => WidgetDefinitionsLoader.initWidgets())
            .catch(err => {
                widgetDefinitions = []; // Clear for next time
                log.error(err);
                throw err;
            });
    }

    public static uninstall(widgetId: any, manager: any) {
        const internal = new Internal(manager);
        return internal.doDelete(`/widgets/${widgetId}`);
    }
}
