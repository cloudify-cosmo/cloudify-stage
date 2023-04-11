import UploadButton from './UploadButton';

Stage.defineWidget<never, never, never>({
    id: 'pluginUploadButton',
    name: 'Plugin upload button',
    description: 'Adds button to upload new plugin',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginUploadButton'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(_widget, _data, _error, toolbox) {
        return <UploadButton toolbox={toolbox} />;
    }
});
