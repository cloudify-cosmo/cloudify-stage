/**
 * Created by jakubniezgoda on 21/05/2018.
 */

import UploadButton from './UploadButton';

Stage.defineWidget({
    id: 'pluginUploadButton',
    name: 'Plugin upload button',
    description: 'Plugin upload button',
    initialWidth: 2,
    initialHeight: 4,
    showHeader: false,
    showBorder: false,
    isReact: true,
    permission: Stage.GenericConfig.WIDGET_PERMISSION('pluginUploadButton'),
    categories: [Stage.GenericConfig.CATEGORY.SYSTEM_RESOURCES, Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    render: function(widget,data,error,toolbox) {
        return (
            <UploadButton toolbox={toolbox} />
        );
    }

});