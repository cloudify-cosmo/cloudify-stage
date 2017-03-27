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
                statusIcon: 'i.signal'
            }
        }
    },

    elements: {
        tenantsDropdownText : 'div.tenantsMenu'
    }
};
