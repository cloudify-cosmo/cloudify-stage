/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {

    sections: {
        buttons: {
            selector: '.blueprintActionButtonsWidget',
            elements: {
                createDeploymentButton: '#createDeploymentButton',
                deleteBlueprintButton: '#deleteBlueprintButton',
                deleteButtonDisabled: '#deleteBlueprintButton.disabled',
            }
        },

        removeConfirm: {
            selector: '.blueprintRemoveConfirm',
            elements: {
                okButton: '.ui.primary.button'
            }
        }
    }

};
