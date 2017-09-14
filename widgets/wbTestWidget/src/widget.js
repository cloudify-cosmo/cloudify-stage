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

    fetchData (widget, toolbox, params) {
        return toolbox.getWidgetBackend(this).doGet('test');
    },

    render: function(widget,data,error,toolbox) {
        let {HighlightText, Message} = Stage.Basic;

        return (
            _.isEmpty(data)
            ?
                <Message>No data fetched</Message>
            :
                <HighlightText>
                    {JSON.stringify(data.items, null, 2)}
                </HighlightText>
        );
    }
});
