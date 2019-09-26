/**
 * Created by jakubniezgoda on 21/05/2018.
 */

import UploadButton from './UploadButton';

Stage.defineWidget({
    id: 'pluginUploadButton',
    name: 'Plugin upload button',
    description: 'Adds button to upload new plugin',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    isReact: true,
    hasReadme: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginUploadButton'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render(widget, data, error, toolbox) {
        return <UploadButton toolbox={toolbox} />;
    }
});
