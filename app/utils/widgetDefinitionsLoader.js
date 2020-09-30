/**
 * Created by kinneretzin on 08/09/2016.
 */

import Internal from './Internal';
import ScriptLoader from './scriptLoader';
import StyleLoader from './StyleLoader';
import 'd3';
import momentImport from 'moment';

import * as Basic from '../components/basic';
import * as Shared from '../components/shared';
import StageUtils from './stageUtils';
import LoaderUtils from './LoaderUtils';

import GenericConfig from './GenericConfig';
import WidgetDefinition from './WidgetDefinition';
import WidgetPropType from './WidgetPropType';

const ReactDOMServer = require('react-dom/server');

let widgetDefinitions = [];

export default class WidgetDefinitionsLoader {
    static init() {
        window.Stage = {
            defineWidget: widgetDefinition => {
                widgetDefinitions.push(new WidgetDefinition({ ...widgetDefinition, id: document.currentScript.id }));
            },
            Basic,
            Shared,
            ComponentToHtmlString: component => {
                return ReactDOMServer.renderToString(component);
            },
            GenericConfig,
            Utils: StageUtils,

            Common: [],
            defineCommon: def => {
                Stage.Common[def.name] = def.common;
            },

            PropTypes: { Widget: WidgetPropType },
            definePropType: def => {
                Stage.PropTypes[def.name] = def.common;
            },

            Hooks: {},
            defineHook: def => {
                Stage.Hooks = { ...Stage.Hooks, ...def };
            }
        };

        window.moment = momentImport;
    }

    static loadWidgets(manager) {
        console.log('Load widgets');

        const internal = new Internal(manager);
        return Promise.all([
            new ScriptLoader(LoaderUtils.getResourceUrl('widgets/common/common.js', false)).load(), // Commons has to load before the widgets
            internal.doGet('/widgets/list') // We can load the list of widgets in the meanwhile
        ]).then(results => {
            const data = results[1]; // widgets data
            const promises = [];
            data.forEach(item => {
                promises.push(WidgetDefinitionsLoader.loadWidget(item, false));
            });

            const output = _.keyBy(data, 'id');
            return Promise.all(promises).then(() => output);
        });
    }

    static loadWidget(widget, rejectOnError) {
        const scriptPath = `${LoaderUtils.getResourceUrl('widgets', widget.isCustom)}/${widget.id}/widget.js`;
        return new ScriptLoader(scriptPath).load(widget.id, rejectOnError);
    }

    static loadWidgetsResources(widgets) {
        console.log('Load widgets resources');

        const promises = [];
        widgetDefinitions.forEach(widgetDefinition => {
            // Mark system widgets to protect against uninstalling
            widgetDefinition.isCustom = widgets[widgetDefinition.id].isCustom;

            if (widgetDefinition.hasTemplate) {
                promises.push(
                    LoaderUtils.fetchResource(
                        `widgets/${widgetDefinition.id}/widget.html`,
                        widgetDefinition.isCustom
                    ).then(widgetHtml => {
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
                    ).then(widgetReadme => {
                        if (widgetReadme) {
                            widgetDefinition.readme = widgetReadme;
                        }
                    })
                );
            }
        });

        return Promise.all(promises);
    }

    static initWidgets() {
        console.log('Init widgets');

        _.each(widgetDefinitions, w => {
            if (w.init && typeof w.init === 'function') {
                w.init();
            }
        });

        const loadedWidgetDefinitions = _.sortBy(widgetDefinitions, ['name']);
        widgetDefinitions = []; // Clear for next time

        return Promise.resolve(loadedWidgetDefinitions);
    }

    static load(manager) {
        return WidgetDefinitionsLoader.loadWidgets(manager)
            .then(widgets => WidgetDefinitionsLoader.loadWidgetsResources(widgets))
            .then(() => WidgetDefinitionsLoader.initWidgets())
            .catch(e => {
                console.error(e);
                widgetDefinitions = []; // Clear for next time
            });
    }

    static installWidget(widgetFile, widgetUrl, manager) {
        const internal = new Internal(manager);

        if (widgetUrl) {
            console.log('Install widget from url', widgetUrl);
            return internal.doPut('/widgets/install', { url: widgetUrl });
        }
        console.log('Install widget from file');
        return internal.doUpload('/widgets/install', {}, { widget: widgetFile });
    }

    static updateWidget(widgetId, widgetFile, widgetUrl, manager) {
        const internal = new Internal(manager);

        if (widgetUrl) {
            console.log(`Update widget ${widgetId} from url`, widgetUrl);
            return internal.doPut('/widgets/update', { url: widgetUrl, id: widgetId });
        }
        console.log(`Update widget ${widgetId} from file`);
        return internal.doUpload('/widgets/update', { id: widgetId }, { widget: widgetFile });
    }

    static validateWidget(widgetId, manager) {
        const errors = [];

        if (_.isEmpty(widgetDefinitions)) {
            errors.push('Widget not properly initialized. Please check if widget.js is correctly defined.');
        } else if (widgetDefinitions.length > 1) {
            errors.push('Only single widget should be defined within widget.js');
        } else {
            const widgetDefinition = widgetDefinitions[0];

            if (!_.includes(_.keys(manager.permissions), widgetDefinition.permission)) {
                errors.push(
                    `Specified widget permission ('${widgetDefinition.permission}') not found in available permissions list.`
                );
            }

            if (_.isEmpty(widgetDefinition.id)) {
                errors.push("Mandatory field - 'id' - not specified in widget definition.");
            }

            if (_.isEmpty(widgetDefinition.name)) {
                errors.push("Mandatory field - 'name' - not specified in widget definition.");
            }
        }

        if (!_.isEmpty(errors)) {
            const errorMessage = errors.length > 1 ? `Multiple errors occured: ${_.join(errors, ' ')}` : errors[0];

            return WidgetDefinitionsLoader.uninstall(widgetId, manager).then(() => {
                throw new Error(errorMessage);
            });
        }

        return Promise.resolve();
    }

    static install(widgetFile, widgetUrl, manager) {
        let widgetData = {};

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
                console.error(err);
                throw err;
            });
    }

    static update(widgetId, widgetFile, widgetUrl, manager) {
        let widgetData = {};

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
                console.error(err);
                throw err;
            });
    }

    static uninstall(widgetId, manager) {
        const internal = new Internal(manager);
        return internal.doDelete(`/widgets/${widgetId}`);
    }
}
