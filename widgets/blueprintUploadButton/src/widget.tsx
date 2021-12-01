// @ts-nocheck File not migrated fully to TS

import UploadButton from './UploadButton';

Stage.defineWidget({
    id: 'blueprintUploadButton',
    name: 'Blueprint upload button',
    description: 'Adds button to upload new blueprint',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('blueprintUploadButton'),
    categories: [Stage.GenericConfig.CATEGORY.BLUEPRINTS, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, data, error, toolbox) {
        return <UploadButton toolbox={toolbox} />;
    }
});
