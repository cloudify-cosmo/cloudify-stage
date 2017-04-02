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
                userDropdownMenu : '.menu'
            }
        }
    },

    elements: {
        tenantsDropdownText : 'div.tenantsMenu',
        statusesTitle: 'table.servicesData tr th',
        statusesName: 'table.servicesData tr td',
        statusesDesc : 'table.servicesData tr td div.sub.header'
    }
};
