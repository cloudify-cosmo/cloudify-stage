/**
 * Created by jakubniezgoda on 13/09/2017.
 */


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
    initialConfiguration: [
        {id: 'service', name: 'Service', default: 'manager', type: Stage.Basic.GenericField.LIST_TYPE,
            items: [
                {name:'Manager', value:'manager'},
                {name:'Database - Create', value:'databaseCreateKey'},
                {name:'Database - Read', value:'databaseReadKey'},
                {name:'Database - Update', value:'databaseUpdateKey'},
                {name:'Database - Delete', value:'databaseDeleteKey'}
            ]
        },
        {id: 'params', name: 'Parameter', default: '', type: Stage.Basic.GenericField.STRING_TYPE}
    ],


    fetchData (widget, toolbox, params) {
        let service = widget.configuration.service;
        if (!_.isEmpty(service)) {
            return toolbox.getWidgetBackend(this).doGet(service);
        } else {
            return Promise.resolve({});
        }
    },

    render: function(widget,data,error,toolbox) {
        let {HighlightText, Message} = Stage.Basic;

        return (
            _.isEmpty(data)
            ?
                <Message>No data fetched</Message>
            :
                <HighlightText>
                    {JSON.stringify(data, null, 2)}
                </HighlightText>
        );
    }
});
