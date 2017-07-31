/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    url: function () {
        return this.api.launch_url + '/page/0';
    },

    sections: {
        managerData: {
            selector: '.managerMenu',
            elements: {
                ip: 'span',
                version: 'span.managerVersion',
                statusIcon: 'i.signal',
                statusIconGreen: 'i.signal.green'
            }
        },
        tenants: {
            selector: '.tenantsMenu',
            elements: {
                tenantName: 'span',
                tenantsDropdownMenu: '.menu',
                tenantsDropdownMenuItem: '.menu .item span'
            }
        },
        userMenu: {
            selector : '.usersMenu',
            elements: {
                userName: 'span:first-child',
                userDropdownMenu : '.menu',
                editModeMenuItem : '#editModeMenuItem'
            },
            props: {
                editModeLabel: 'Edit Mode',
                exitModeLabel: 'Exit Edit Mode'
            }
        },
        sidebar: {
            selector : '.sidebarContainer',
            elements: {
                addPageButton: '.addPageContainer button',
                lastPage: '.pages .item:last-child',
                lastPageRemoveButton : '.pages .item:last-child .pageRemoveButton'
            },
            props: {
                lastPageLabel: 'Page_0'
            }
        },
        page: {
            selector: '.page',
            elements: {
                addWidgetButton: '.addWidgetBtn',
                firstWidget: '.widget:first-child',
                firstWidgetName: '.widget:first-child h5.header span',
                firstWidgetRemoveIcon: '.widget:first-child .widgetEditButtons i.remove.link.icon.small',
                firstWidgetConfigureIcon: '.widget:first-child .widgetEditButtons .editWidgetIcon',
                firstWidgetResizeHandle: '.widget:first-child .ui-resizable-handle',
                testWidgetContent: '.widget.testWidgetWidget .widgetContent .statistic .label'
            },
            props: {
                testWidgetLabel: 'DEPLOYMENTS'
            }
        },
        addWidgetModal: {
            selector: '.addWidgetModal',
            elements: {
                searchInput : 'input',
                installWidgetBtn: '#installWidgetBtn',
                removeWidgetButton: '.widgetsList .item[data-id="testWidget"] .removeWidgetButton',
                updateWidgetButton: '.widgetsList .item[data-id="testWidget"] .updateWidgetButton'

            },
            commands: [{
                selectAndAddWidget: function(widgetId) {
                    this.clickElement('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .addWidgetCheckbox')
                        .waitForElementPresent('.item[data-id="'+widgetId+'"] .addWidgetCheckbox.checked.checkbox');

                    return this.clickElement('#addWidgetsBtn')
                        .waitForElementNotPresent('.addWidgetModal')
                        .waitForElementPresent('.widget.' + widgetId + 'Widget');
                },

                isWidgetInstalled: function(widgetId, callback) {
                    return this.isPresent('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .selectWidgetButton', callback);
                }
            }]
        },
        installWidgetModal : {
            selector: '.installWidgetModal',
            elements: {
                urlField: 'input[name="widgetUrl"]',
                fileField: 'input[name="widgetFile"]',
                okButton: '.ui.green.button',
                cancelButton: '.ui.basic.button',
                errorMessage: '.ui.error.message',
                loader: '.ui.loading'
            },
            props: {
                emptyFieldsError: 'Please select widget file or url',
                invalidURIError: 'Invalid URI "test"',
                bothFieldsError: 'Either widget file or url must be selected, not both',
                incorrectFilesError: 'The following files are required for widget registration: widget.js, widget.png',
                widgetAlreadyInstalledError: 'Widget testWidget is already installed'
            }
        },
        removeWidgetConfirm: {
            selector: '.removeWidgetConfirm',
            elements: {
                okButton: '.ui.primary.button',
                cancelButton: '.ui.button',
                widgetIsUsedLabel: '.ui.basic.segment h5'
            },
            props: {
                widgetIsUsed: 'Widget is currently used by:'
            }
        }
    },

    elements: {
        tenantsDropdownText : 'div.tenantsMenu',
        statusesTitle: 'table.servicesData tr th',
        statusesName: 'table.servicesData tr td',
        statusesDesc : 'table.servicesData tr td div.sub.header',
        breadcrumb: '.breadcrumbLineHeight',
        pageTitle: '.pageTitle'
    }
};
