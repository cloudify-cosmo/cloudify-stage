/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    url: function () {
        return this.api.launch_url + '/login';
    },
    elements: {
        ipField: 'input[name="ip"]',
        usernameField: 'input[name="username"]',
        passwordField: 'input[name="password"]',
        submitButton: 'button[type="submit"]',
        tenantsDropdownText : 'div.tenantsMenu .dropDownText'
    }
};
