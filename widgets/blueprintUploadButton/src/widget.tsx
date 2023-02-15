import UploadButton from './UploadButton';

Stage.defineWidget<never, never, never>({
    id: 'blueprintUploadButton',
    name: 'Blueprint upload button',
    description: 'Adds button to upload new blueprint',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintUploadButton'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(_widget, _data, _error, toolbox) {
        return <UploadButton toolbox={toolbox} />;
    }
});
