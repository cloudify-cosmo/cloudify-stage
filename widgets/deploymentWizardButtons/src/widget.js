/**
 * Created by jakub.niezgoda on 26/07/2018.
 */

import HelloWorldWizardButton from './HelloWorldWizardButton';

Stage.defineWidget({
    id: 'deploymentWizardButtons',
    name: 'Deployment Wizard Buttons',
    description: 'Shows buttons to start deployment wizard',
    initialWidth: 2,
    initialHeight: 4,
    isReact: true,
    showHeader: false,
    showBorder: false,
    categories: [Stage.GenericConfig.CATEGORY.BUTTONS_AND_FILTERS],

    initialConfiguration: [],
    permission: Stage.GenericConfig.WIDGET_PERMISSION('deploymentWizardButtons'),

    render: function(widget, data, error, toolbox) {
        return (
            <HelloWorldWizardButton toolbox={toolbox} />
        );
    }

});