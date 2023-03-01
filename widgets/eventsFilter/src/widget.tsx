import EventFilter from './EventFilter';

Stage.defineWidget({
    id: 'eventsFilter',
    initialWidth: 12,
    initialHeight: 5,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('eventsFilter'),
    initialConfiguration: [],

    render(_widget, _data, _error, toolbox) {
        return <EventFilter toolbox={toolbox} />;
    }
});
