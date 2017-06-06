/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    sections: {
        tableView: {
            selector: '.deploymentsWidget',
            elements: {
            }
        },
        catalogView: {
            selector: '.deploymentsWidget',
            elements: {
            }
        },

        deployModal: {
            selector: '.deployBlueprintModal',
            elements: {
                deploymentName: 'input[name="deploymentName"]',
                okButton: '.ui.button.ok'
            },
            commands: [{
                setInputsValue: function(inputs) {
                    if (!inputs || inputs.length <= 0) {
                        return this;
                    }

                    for (var name in inputs) {
                        this.setValue('input[name="' + name + '"]', inputs[name]);
                    }

                    return this;
                }
            }]
        }
    },
    elements: {
        deployModal: '.deployBlueprintModal'
    },
    props: {
        widgetId: "deployments"
    }
};
