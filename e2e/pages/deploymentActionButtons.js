/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {

    sections: {
        buttons: {
            selector: '.deploymentActionButtonsWidget',
            elements: {
                executeWorkflowButton: '#executeWorkflowButton',
                executeButtonDisabled: '#executeWorkflowButton.disabled',
                updateDeploymentButton: '#updateDeploymentButton',
                updateButtonDisabled: '#updateDeploymentButton.disabled',
                deleteDeploymentButton: '#deleteDeploymentButton',
                deleteButtonDisabled: '#deleteDeploymentButton.disabled'
            }
        },

        removeConfirm: {
            selector: '.deploymentRemoveConfirm',
            elements: {
                okButton: '.ui.primary.button'
            }
        }
    },
    props: {
        widgetId: "deploymentActionButtons"
    }
};
