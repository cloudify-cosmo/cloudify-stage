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
                packageName: 'tr.clickable td:nth-child(2)',
                deleteButton: '.rowActions i.trash'
            }
        },
        deleteConfirmModal: {
            selector: '.confirmModal',
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
            openUploadModal: function() {
                return this.waitForElementVisible('@uploadButton', 10000)
                    .clickElement('@uploadButton')
                    .waitForElementVisible(this.section.uploadModal.selector, 10000);
            },
            fillWagonUrl: function(url) {
                return this.section.uploadModal.setValue('@wagonUrl', url).parent;
            },
            fillYamlUrl: function(url) {
                return this.section.uploadModal.setValue('@yamlUrl', url).parent;
            },
            uploadPlugin: function() {
                return this.section.uploadModal.clickElement('@uploadButton')
                    .waitForElementNotPresent(this.section.uploadModal.selector, function(){
                        this.pause(1000);
                    }).parent;
            },
            deletePlugin: function() {
                return this.section.pluginsTable.clickElement('@deleteButton')
                    .parent.section.deleteConfirmModal.clickElement('@yesButton')
                    .parent.section.pluginsTable.waitForElementNotPresent('@packageName').parent;
            }
        }
    ],
        props: {
        widgetId: 'plugins',
        testWagonUrl: 'http://repository.cloudifysource.org/cloudify/wagons/cloudify-diamond-plugin/1.3.6/cloudify_diamond_plugin-1.3.6-py26-none-linux_x86_64-centos-Final.wgn',
        testYamlUrl: 'http://www.getcloudify.org/spec/diamond-plugin/1.3.6/plugin.yaml',
        pluginPackageName: 'cloudify-diamond-plugin'
    }
};