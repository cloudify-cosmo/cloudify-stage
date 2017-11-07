/**
 * Created by jakubniezgoda on 13/09/2017.
 */

import TestDataTable from './TestDataTable';
import CreateControls from './CreateControls';

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
                {name:'Manager', value:'manager'},
                {name:'Local Storage', value:'wbTestReadItems'}
            ]
        },
        {id: 'endpoint', name: 'Endpoint (only for Manager service)', default: 'users', type: Stage.Basic.GenericField.STRING_TYPE}
    ],

    fetchData (widget, toolbox, params) {
        let service = widget.configuration.service;
        let endpoint = widget.configuration.endpoint;
        if (!_.isEmpty(service)) {
            return toolbox.getWidgetBackend().doGet(service, {endpoint});
        } else {
            return Promise.resolve({items:[]});
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
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let {Message, HighlightText} = Stage.Basic;

        return (
        widget.configuration.service === 'wbTestReadItems' ?
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
            :
            <HighlightText>
                {JSON.stringify(data.items, null, 2)}
            </HighlightText>
        );
    }
});
