/**
 * Created by edenp on 22/01/2018.
 */

module.exports = {
    sections: {
        uploadModal: {
            selector: 'div.ui.modal',
            elements: {
                wagonUrl: 'input[name=wagonUrl]',
                yamlUrl: 'input[name=yamlUrl]',
                uploadButton: '.actions button.ui.green.button.ok'
            }
        },
        pluginsTable: {
            selector: '.pluginsTable',
            elements: {
                searchInput: 'input',
                packageName: 'tr.clickable td:nth-child(2)',
                deleteButton: '.rowActions i.trash'
            }
        },
        deleteConfirmModal: {
            selector: '.modal',
            elements: {
                yesButton: '.actions .ui.primary'
            }
        }
    },
    elements: {
        uploadButton: '.actionField button'
    },
    commands: [
        {
            openUploadModal() {
                return this.waitForElementVisible('@uploadButton')
                    .clickElement('@uploadButton')
                    .waitForElementVisible(this.section.uploadModal.selector);
            },
            fillWagonUrl(url) {
                return this.section.uploadModal.setElementValue('@wagonUrl', url).parent;
            },
            fillYamlUrl(url) {
                return this.section.uploadModal.setElementValue('@yamlUrl', url).parent;
            },
            searchFor(text) {
                this.section.pluginsTable.setElementValue('@searchInput', text).api.pause(2000);
                return this;
            },
            uploadPlugin() {
                return this.section.uploadModal
                    .clickElement('@uploadButton')
                    .waitForElementNotPresent(this.section.uploadModal.selector, function() {
                        this.pause(1000);
                    }).parent;
            },
            deletePlugin() {
                return this.section.pluginsTable
                    .clickElement('@deleteButton')
                    .parent.section.deleteConfirmModal.clickElement('@yesButton')
                    .parent.section.pluginsTable.waitForElementNotPresent('@packageName').parent;
            }
        }
    ],
    props: {
        widgetId: 'plugins',
        testWagonUrl:
            'http://repository.cloudifysource.org/cloudify/wagons/cloudify-diamond-plugin/1.3.6/cloudify_diamond_plugin-1.3.6-py26-none-linux_x86_64-centos-Final.wgn',
        testYamlUrl: 'http://www.getcloudify.org/spec/diamond-plugin/1.3.6/plugin.yaml',
        pluginPackageName: 'cloudify-diamond-plugin'
    }
};
