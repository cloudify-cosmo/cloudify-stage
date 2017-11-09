/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import RequestServiceDemo from './RequestServiceDemo';
import ManagerServiceDemo from './ManagerServiceDemo';
import DatabaseServiceDemo from './DatabaseServiceDemo';

Stage.defineWidget({
    id: 'wbTest',
    name: 'Test widget',
    description: 'Test widget for widget backend support',
    initialWidth: 6,
    initialHeight: 7,
    showHeader: true,
    showBorder: true,
    isReact: true,
    categories: [Stage.GenericConfig.CATEGORY.OTHERS],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ALL,
    initialConfiguration: [
        {id: 'service', name: 'Service', default: 'manager', type: Stage.Basic.GenericField.LIST_TYPE,
            items: [
                {name: 'Manager', value: 'manager'},
                {name: 'Request', value: 'request'},
                {name: 'Database', value: 'database'}
            ]
        }
    ],

    render: function(widget,data,error,toolbox) {

        switch(widget.configuration.service) {
            case 'database':
                return (
                    <DatabaseServiceDemo widgetBackend={toolbox.getWidgetBackend()}/>
                );
                break;
            case 'manager':
                return (
                    <ManagerServiceDemo widgetBackend={toolbox.getWidgetBackend()}/>
                );
                break;
            case 'request':
                return (
                    <RequestServiceDemo widgetBackend={toolbox.getWidgetBackend()}/>
                );
                break;
        };
    }
});
