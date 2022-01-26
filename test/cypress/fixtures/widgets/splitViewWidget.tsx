Stage.defineWidget({
    id: 'split-view-widget',
    name: 'Split view widget',
    isReact: true,
    render: () => {
        const { WidgetsGrid } = Stage.Shared.Widgets;

        return (
            <div>
                This is a split view widget
                <WidgetsGrid isEditMode={false} onGridDataChange={_.noop}>
                    <WidgetsGrid.Item height={4} width={4} key="content-left" id="content-left">
                        Content on the left
                    </WidgetsGrid.Item>
                    <WidgetsGrid.Item height={4} width={4} x={10} key="content-right" id="content-right">
                        Content on the right, above plugins catalog
                    </WidgetsGrid.Item>
                    {WidgetsGrid.renderWidgetGridItem({
                        isEditMode: false,
                        onWidgetRemoved: _.noop,
                        onWidgetUpdated: _.noop,
                        widget: {
                            id: 'pluginsCatalog',
                            configuration: {
                                jsonPath: 'http://repository.cloudifysource.org/cloudify/wagons/v2_plugins.json'
                            },
                            definition: 'pluginsCatalog',
                            drillDownPages: {},
                            height: 20,
                            width: 10,
                            maximized: false,
                            name: 'Plugins Catalog',
                            x: 0,
                            y: 4
                        }
                    })}
                </WidgetsGrid>
            </div>
        );
    }
});
