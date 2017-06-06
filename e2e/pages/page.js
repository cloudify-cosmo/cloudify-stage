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
                userName: 'span',
                userDropdownMenu : '.menu',
                editModeMenuItem : '#editModeMenuItem'
            },
            props: {
                editModeLabel: "Edit Mode",
                exitModeLabel: "Exit Edit Mode"
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
                lastPageLabel: "Page_0"
            }
        },
        page: {
            selector: '.page',
            elements: {
                addWidgetButton: '.addWidgetBtn',
                firstWidget: '.widget',
                firstWidgetName: '.widget h5.header span',
                firstWidgetRemoveIcon: '.widget .widgetEditButtons i.remove.link.icon.small',
                firstWidgetConfigureIcon: '.widget .widgetEditButtons .editWidgetIcon',
                firstWidgetResizeHandle: '.widget .ui-resizable-handle'
            }
        },
        addWidgetModal: {
            selector: '.addWidgetModal',
            elements: {
                searchInput : 'input'
            },
            commands: [{
                clickAddWidget: function(widgetId) {
                    return this.waitForElementPresent('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .extra .button')
                        .click('.addWidgetModal .widgetsList .item[data-id="'+widgetId+'"] .extra .button')
                        .waitForElementNotVisible('.addWidgetModal')
                        .waitForElementPresent('.widget.' + widgetId + "Widget");
                }
            }]
        }
    },

    elements: {
        tenantsDropdownText : 'div.tenantsMenu',
        statusesTitle: 'table.servicesData tr th',
        statusesName: 'table.servicesData tr td',
        statusesDesc : 'table.servicesData tr td div.sub.header'
    }
};
