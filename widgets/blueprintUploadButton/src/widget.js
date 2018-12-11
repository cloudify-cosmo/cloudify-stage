/**
 * Created by jakubniezgoda on 22/05/2018.
 */

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

    render: function(widget,data,error,toolbox) {
        return (
            <UploadButton toolbox={toolbox} />
        );
    }

});