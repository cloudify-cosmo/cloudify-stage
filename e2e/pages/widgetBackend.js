/**
 * Created by pposel on 28/11/2017.
 */

module.exports = {
    sections: {
        installWidget : {
            selector: '.installWidgetModal',
            elements: {
            },
            props: {
                notAllowedModuleError: "The module 'fs-extra' is not whitelisted in VM.",
            }
        },
        brokenWidget : {
            selector: '.widget.BrokenBackendWidget2Widget',
            elements: {
                endpoint: 'input[name="endpoint"]',
                fireBtn: '.basic.compact.table .ui.button',
                errorMsg: '.ui.error.message .content'
            },
            props: {
                notAllowedModuleError: "The module 'fs-extra' is not whitelisted in VM.",
            }
        },
        backendWidget : {
            selector: '.widget.BackendWidgetWidget',
            elements: {
                endpoint: 'input[name="endpoint"]',
                fireBtn: '.basic.compact.table .ui.button',
                jsonResult: '.widgetContent .ui.segment pre code.hljs.json',
                configIcon: '.setting.link.icon.small.editWidgetIcon',
                urlIcon: '.widgetContent .ui.labeled.input .ui.label',
                urlInput: 'input[name="url"]',
                xmlResult: '.widgetContent .ui.segment pre code.hljs.xml',
            },
            props: {
                urlLabel: 'URL',
                blankUrl: 'http://blank.org/'
            }
        },
        widgetConfig: {
            selector: '.ui.modal.editWidgetModal',
            elements: {
                dropdown: '.ui.dropdown',
                saveBtn: '.ui.button.ok'
            },
            props: {
                requestItem: 'Request'
            }
        }
    },

    props: {
        broken1WidgetId: 'BrokenBackendWidget1',
        broken2WidgetId: 'BrokenBackendWidget2',
        widgetId: 'BackendWidget',
        broken1WidgetFilename: 'BrokenBackendWidget1.zip',
        broken2WidgetFilename: 'BrokenBackendWidget2.zip',
        widgetFilename: 'BackendWidget.zip'
    },

};
