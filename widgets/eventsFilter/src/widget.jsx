/**
 * Created by pposel on 07/02/2017.
 */

import EventFilter from './EventFilter';

Stage.defineWidget({
    id: 'eventsFilter',
    name: 'Events/logs filter',
    description: 'Adds a filter section for events and logs',
    initialWidth: 12,
    initialHeight: 5,
    color: 'pink',
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('eventsFilter'),
    initialConfiguration: [],

    render(widget, data, error, toolbox) {
        return <EventFilter data={data} toolbox={toolbox} />;
    }
});
