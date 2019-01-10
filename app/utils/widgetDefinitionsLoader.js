/**
 * Created by kinneretzin on 08/09/2016.
 */

import Internal from './Internal';
import ScriptLoader from './scriptLoader';
import StyleLoader from './StyleLoader';

const ReactDOMServer = require('react-dom/server');

import 'd3';
import momentImport from 'moment';
import markdownImport from 'markdown';

import * as BasicComponents from '../components/basic';
import StageUtils from './stageUtils';
import LoaderUtils from './LoaderUtils';
import Pagination from '../components/basic/pagination/Pagination';

import WidgetDefinition from './WidgetDefinition';
let widgetDefinitions = [];

export default class WidgetDefinitionsLoader {
    static init() {
        window.Stage = {
            defineWidget: (widgetDefinition) => {
                widgetDefinitions.push(new WidgetDefinition({...widgetDefinition, id: document.currentScript.id}));
            },
            Basic: BasicComponents,
            ComponentToHtmlString: (component) => {
                return ReactDOMServer.renderToString(component);
            },
            GenericConfig,
            Common: [],
            defineCommon: (def) => {
                Stage.Common[def.name] = def.common;
            },
            Utils: StageUtils
        };
        
        window.moment = momentImport;
        window.markdown = markdownImport;
    }

    static _loadWidgets(manager) {
        console.log('Load widgets');

        var internal = new Internal(manager);
        return Promise.all([
                new ScriptLoader(LoaderUtils.getResourceUrl('widgets/common/common.js', false)).load(), // Commons has to load before the widgets
                internal.doGet('/widgets/list') // We can load the list of widgets in the meanwhile
            ])
            .then((results)=> {
                var data = results[1]; // widgets data
                var promises = [];
                data.forEach((item)=>{
                    promises.push(WidgetDefinitionsLoader._loadWidget(item, false));
                });

                var output = _.keyBy(data, 'id');
                return Promise.all(promises).then(() => output);
            });
    }

    static _loadWidget(widget, rejectOnError) {
        var scriptPath = `${LoaderUtils.getResourceUrl('widgets', widget.isCustom)}/${widget.id}/widget.js`;
        return new ScriptLoader(scriptPath).load(widget.id, rejectOnError);
    }

    static _loadWidgetsResources(widgets) {
        console.log('Load widgets resources');

        var promises = [];
        widgetDefinitions.forEach((widgetDefinition)=> {
            //Mark system widgets to protect against uninstalling
            widgetDefinition.isCustom = widgets[widgetDefinition.id].isCustom;

            if (widgetDefinition.hasTemplate) {
                promises.push(
                    LoaderUtils.fetchResource(`widgets/${widgetDefinition.id}/widget.html`, widgetDefinition.isCustom)
                        .then((widgetHtml)=> {
                            if (widgetHtml) {
                                widgetDefinition.template = widgetHtml;
                            }
                        }));
            }
            if (widgetDefinition.hasStyle) {
                promises.push(new StyleLoader(LoaderUtils.getResourceUrl(`widgets/${widgetDefinition.id}/widget.css`, widgetDefinition.isCustom)).load());
            }

            if (widgetDefinition.hasReadme) {
                promises.push(
                    LoaderUtils.fetchResource(`widgets/${widgetDefinition.id}/README.md`, widgetDefinition.isCustom)
                        .then((widgetReadme) => {
                            if (widgetReadme) {
                                widgetDefinition.readme = widgetReadme;
                            }
                        }));
            }
        });

        return Promise.all(promises);
    }

    static _initWidgets() {
        console.log('Init widgets');

        _.each(widgetDefinitions,w=>{
            if (w.init && typeof w.init === 'function') {
                w.init();
            }
        });

        var loadedWidgetDefinitions = _.sortBy(widgetDefinitions, ['name']);
        widgetDefinitions = []; // Clear for next time

        return Promise.resolve(loadedWidgetDefinitions);
    }

    static load(manager) {
        return WidgetDefinitionsLoader._loadWidgets(manager)
            .then((widgets) => WidgetDefinitionsLoader._loadWidgetsResources(widgets))
            .then(() => WidgetDefinitionsLoader._initWidgets())
            .catch((e)=>{
                console.error(e);
                widgetDefinitions = []; // Clear for next time
            });
    }

    static _installWidget(widgetFile, widgetUrl, manager) {
        var internal = new Internal(manager);

        if (widgetUrl) {
            console.log('Install widget from url', widgetUrl);
            return internal.doPut('/widgets/install', {url: widgetUrl});
        } else {
            console.log('Install widget from file');
            return internal.doUpload('/widgets/install', {}, {widget:widgetFile});
        }
    }

    static _updateWidget(widgetId, widgetFile, widgetUrl, manager) {
        var internal = new Internal(manager);

        if (widgetUrl) {
            console.log('Update widget ' + widgetId + ' from url', widgetUrl);
            return internal.doPut('/widgets/update',{url: widgetUrl, id: widgetId});
        } else {
            console.log('Update widget ' + widgetId + ' from file');
            return internal.doUpload('/widgets/update',{id: widgetId},{widget:widgetFile});
        }
    }

    static _validateWidget(widgetId, manager) {
        let errors = [];

        if (_.isEmpty(widgetDefinitions)) {
            errors.push('Widget not properly initialized. Please check if widget.js is correctly defined.');
        } else if (widgetDefinitions.length > 1) {
            errors.push('Only single widget should be defined within widget.js');
        } else {
            const widgetDefinition = widgetDefinitions[0];

            if (!_.includes(_.keys(manager.permissions), widgetDefinition.permission)) {
                errors.push(`Specified widget permission ('${widgetDefinition.permission}') not found in available permissions list.`);
            }

            if (_.isEmpty(widgetDefinition.id)) {
                errors.push("Mandatory field - 'id' - not specified in widget definition.");
            }

            if (_.isEmpty(widgetDefinition.name)) {
                errors.push("Mandatory field - 'name' - not specified in widget definition.");
            }
        }

        if (!_.isEmpty(errors)) {
            let errorMessage = errors.length > 1
                ? `Multiple errors occured: ${_.join(errors, ' ')}`
                : errors[0];

            return WidgetDefinitionsLoader.uninstall(widgetId, manager).then(() => { throw new Error(errorMessage) });
        }

        return Promise.resolve();
    }

    static install(widgetFile, widgetUrl, manager) {
        let widgetData = {};

        return WidgetDefinitionsLoader._installWidget(widgetFile, widgetUrl, manager)
            .then(data => {
                widgetData = data;
                return WidgetDefinitionsLoader._loadWidget(data, true);
            }).then(() => WidgetDefinitionsLoader._validateWidget(widgetData.id, manager))
            .then(() => WidgetDefinitionsLoader._loadWidgetsResources(_.keyBy([widgetData], 'id')))
            .then(() => WidgetDefinitionsLoader._initWidgets())
            .catch(err => {
                widgetDefinitions = []; // Clear for next time
                console.error(err);
                throw err;
            })
    }

    static update(widgetId, widgetFile, widgetUrl, manager) {
        let widgetData = {};

        return WidgetDefinitionsLoader._updateWidget(widgetId, widgetFile, widgetUrl, manager)
            .then(data => {
                widgetData = data;
                return WidgetDefinitionsLoader._loadWidget(data, true);
            }).then(() => WidgetDefinitionsLoader._validateWidget(widgetData.id, manager))
            .then(() => WidgetDefinitionsLoader._loadWidgetsResources(_.keyBy([widgetData], 'id')))
            .then(() => WidgetDefinitionsLoader._initWidgets())
            .catch(err => {
                widgetDefinitions = []; // Clear for next time
                console.error(err);
                throw err;
            })
    }

    static uninstall(widgetId, manager) {
        var internal = new Internal(manager);
        return internal.doDelete(`/widgets/${widgetId}`)
    }

}

class GenericConfig {
    static POLLING_TIME_CONFIG = (pollingTime = 0) => {
        return {id: 'pollingTime',
                name: 'Refresh time interval',
                default: pollingTime,
                placeHolder: 'Enter time interval in seconds',
                description: 'Data of the widget will be refreshed per provided interval time in seconds',
                type: BasicComponents.GenericField.NUMBER_TYPE}
    };

    static PAGE_SIZE_CONFIG = (pageSize = Pagination.PAGE_SIZE_LIST(5)[0]) => {
        return {id: 'pageSize',
                default: pageSize,
                hidden: true}
    };

    static SORT_COLUMN_CONFIG = (sortColumn) => {
        return {id: 'sortColumn',
                default: sortColumn,
                hidden: true}
    };

    static SORT_ASCENDING_CONFIG = (sortAscending) => {
        return {id: 'sortAscending',
                default: sortAscending,
                hidden: true}
    };
    
    static get CATEGORY ()  {
        return {
            BLUEPRINTS: 'Blueprints',
            DEPLOYMENTS: 'Deployments',
            BUTTONS_AND_FILTERS: 'Buttons and Filters',
            CHARTS_AND_STATISTICS: 'Charts and Statistics',
            EXECUTIONS_NODES: 'Executions/Nodes',
            SYSTEM_RESOURCES: 'System Resources',
            OTHERS: 'Others',
            ALL: 'All'
        };
    }

    static get CUSTOM_WIDGET_PERMISSIONS () {
        return {
            CUSTOM_ADMIN_ONLY: 'widget_custom_admin',
            CUSTOM_SYS_ADMIN_ONLY: 'widget_custom_sys_admin',
            CUSTOM_ALL: 'widget_custom_all'
        };
    }

    static WIDGET_PERMISSION = (widgetId) => {
        return 'widget_'+widgetId
    }
}

