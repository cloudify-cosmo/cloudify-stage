/**
 * Created by jakubniezgoda on 24/05/2018.
 */

import MaintenanceModeButton from './MaintenanceModeButton';

Stage.defineWidget({
    id: 'maintenanceModeButton',
    name: 'Maintenance Mode button',
    description: 'Adds button to activate Maintenance Mode',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('maintenanceModeButton'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render: function(widget,data,error,toolbox) {
        return (
            <MaintenanceModeButton toolbox={toolbox} />
        );
    }

});