import MyResourcesCheckbox from './MyResourcesCheckbox';

Stage.defineWidget<never, never, never>({
    id: 'onlyMyResources',
    name: 'Show Only My Resources',
    description: 'Show only my resources checkbox, work with (plugins, snapshots, blueprints, deployments)',
    initialWidth: 12,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('onlyMyResources'),

    render(_widget, _data, _error, toolbox) {
        return <MyResourcesCheckbox toolbox={toolbox} />;
    }
});
