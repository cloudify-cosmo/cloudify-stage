/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import TestDataTable from './TestDataTable';
import CreateControls from './CreateControls';
import RequestServiceDemo from './RequestServiceDemo';
import ManagerServiceDemo from './ManagerServiceDemo';

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
                {name: 'Database', value: 'wbTestReadItems'}
            ]
        }
    ],

    fetchData (widget, toolbox, params) {
        let service = widget.configuration.service;
        if (service === 'wbTestReadItems') {
            return toolbox.getWidgetBackend().doGet(service);
        } else {
            return Promise.resolve({});
        }
    },

    _createInDb(toolbox, key, value) {
        toolbox.getWidgetBackend().doGet('wbTestCreateItem', {key, value});
        toolbox.refresh();
    },

    _dbDelete(toolbox, id) {
        toolbox.getWidgetBackend().doGet('wbTestDeleteItem', {id})
        toolbox.refresh();
    },

    render: function(widget,data,error,toolbox) {
        let {Message} = Stage.Basic;

        switch(widget.configuration.service) {
            case 'wbTestReadItems':
                return (
                    <div>
                        <CreateControls onCreate={this._createInDb.bind(this, toolbox)}/>
                        {
                            _.isEmpty(data.items)
                                ?
                                <Message>No data available</Message>
                                :
                                <TestDataTable data={data} onDelete={this._dbDelete.bind(this, toolbox)}/>
                        }
                    </div>
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
