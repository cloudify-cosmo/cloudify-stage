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
        {id: 'params', name: 'Parameter', default: '', type: Stage.Basic.GenericField.STRING_TYPE}
    ],


    fetchData (widget, toolbox, params) {
        let service = widget.configuration.service;
        if (!_.isEmpty(service)) {
            return toolbox.getWidgetBackend().doGet(service);
        } else {
            return Promise.resolve({});
        }
    },

    _createInDb(widgetBackend, key, value) {
        widgetBackend.doGet('wbTestCreateItem', {key, value});
    },

    _dbDelete(widgetBackend, key) {
        widgetBackend.doGet('wbTestDeleteItem', {key})
    },

    render: function(widget,data,error,toolbox) {
        if (_.isEmpty(data)) {
            return <Stage.Basic.Loading/>;
        }

        let {Message, HighlightText} = Stage.Basic;

        //TODO: we should have a better way of calling refresh after data update
        //TODO: Dont send widgetBackend ref to child only to get it back in parent's private function

        let content = ((_.isEmpty(data) && widget.configuration.service === 'wbTestReadItems') ? <Message>No data fetched</Message> :
            <TestDataTable data={data} widgetBackend={toolbox.getWidgetBackend()} onDelete={this._dbDelete} refreshData={toolbox.refresh} />);

        return (
        widget.configuration.service === 'wbTestReadItems' ?
            <div>
                <CreateControls onCreate={this._createInDb} widgetBackend={toolbox.getWidgetBackend()} refreshData={toolbox.refresh}/>
                {content}
            </div>
            :
            <HighlightText>
                {JSON.stringify(data.items, null, 2)}
            </HighlightText>
        );
    }
});
