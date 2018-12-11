/**
 * Created by jakubniezgoda on 20/03/2017.
 */

Stage.defineWidget({
    id: 'timeFilter',
    name: 'Time filter',
    description: 'Adds time filter for deployment metric graphs',
    initialWidth: 6,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('timeFilter'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    _onChange: function(proxy, field) {
        let timeFilter = field.value;
        timeFilter = _.isEmpty(timeFilter.start) || _.isEmpty(timeFilter.end) ? undefined : timeFilter;
        this.toolbox.getContext().setValue('timeFilter', timeFilter);
        this.toolbox.getEventBus().trigger('graph:refresh');
    },

    render: function(widget,data,error,toolbox) {
        let {TimeFilter} = Stage.Basic;
        let value = toolbox.getContext().getValue('timeFilter');
        this.toolbox = toolbox;

        return (
            <TimeFilter name='timeFilter' value={value || TimeFilter.EMPTY_VALUE}
                        defaultValue={TimeFilter.EMPTY_VALUE}
                        placeholder='Click to set time range and resolution'
                        onChange={this._onChange.bind(this)} />
        );
    }
});
