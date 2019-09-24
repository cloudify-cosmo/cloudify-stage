/**
 * Created by jakubniezgoda on 24/05/2018.
 */

import MaintenanceModeButton from './MaintenanceModeButton';

Stage.defineWidget({
    id: 'maintenanceModeButton',
    name: 'Maintenance Mode button',
    description: 'Adds button to activate Maintenance Mode',
    initialWidth: 3,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('maintenanceModeButton'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, data, error, toolbox) {
        return <MaintenanceModeButton toolbox={toolbox} />;
    }
});
