/**
 * Created by pposel on 26/05/2017.
 */

module.exports = {
    sections: {
        tableView: {
            selector: '.blueprintsWidget',
            elements: {
            }
        },
        catalogView: {
            selector: '.blueprintsWidget',
            elements: {
            }
        },

        uploadModal: {
            selector: '.uploadBlueprintModal',
            elements: {
                blueprintName: 'input[name="blueprintName"]',
                blueprintFile: 'input[name="blueprintFile"]',
                okButton: '.ui.button.ok',
                errorMessage: 'ui error message'
            }
        }
    },
    elements: {
        uploadButton: '.blueprintsWidget .uploadBlueprintButton',
        uploadModal: '.uploadBlueprintModal'
    },
    props: {
        widgetId: "blueprints",
        testBlueprint: "blueprint"
    }

};
