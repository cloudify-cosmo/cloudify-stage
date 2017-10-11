/**
 * Created by jakubniezgoda on 20/03/2017.
 */

import TimeFilter from './TimeFilter';

Stage.defineWidget({
    id: 'timeFilter',
    name: 'Time filter',
    description: 'Adds time filters for deployment metric graphs',
    initialWidth: 6,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('timeFilter'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render: function(widget,data,error,toolbox) {
        return (
            <TimeFilter toolbox={toolbox}/>
        );
    }
});
