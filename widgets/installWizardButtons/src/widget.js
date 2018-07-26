/**
 * Created by jakub.niezgoda on 26/07/2018.
 */

import InstallHelloWorldButton from './InstallHelloWorldButton';

Stage.defineWidget({
    id: 'installWizardButtons',
    name: 'Install Wizard Buttons',
    description: 'Shows buttons to start blueprint installation wizard',
    initialWidth: 2,
    initialHeight: 4,
    isReact: true,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [],
    permission: Stage.GenericConfig.CUSTOM_WIDGET_PERMISSIONS.CUSTOM_ADMIN_ONLY,
    // TODO: Change permissions to:
    // permission: Stage.GenericConfig.WIDGET_PERMISSION('installWizardButtons'),

    render: function(widget, data, error, toolbox) {
        return (
            <InstallHelloWorldButton />
        );
    }

});