import MaintenanceModeButton, { getMaintenanceModeState } from './MaintenanceModeButton';

const widgetDefinition: Stage.Types.InitialWidgetDefinition<unknown, any, { pollingTime: number }> = {
    id: 'maintenanceModeButton',
    name: 'Maintenance Mode button',
    description: 'Adds button to activate Maintenance Mode',
    initialWidth: 3,
    initialHeight: 3,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('maintenanceModeButton'),
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],
    initialConfiguration: [Stage.GenericConfig.POLLING_TIME_CONFIG(10)],
    fetchUrl: '[manager]/maintenance',

    render(_widget, data, _error) {
        if (Stage.Utils.isEmptyWidgetData(data)) {
            return <Stage.Basic.Loading />;
        }

        return <MaintenanceModeButton maintenanceMode={getMaintenanceModeState(data)} />;
    }
};

Stage.defineWidget(widgetDefinition);
