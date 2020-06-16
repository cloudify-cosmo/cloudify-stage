/**
 * Created by kinneretzin on 25/12/2016.
 */

module.exports = {
    url() {
        return `${this.api.launch_url}/login`;
    },
    elements: {
        usernameField: 'input[name="username"]',
        passwordField: 'input[name="password"]',
        submitButton: 'button[type="submit"]',
        statusIcon: '.statusIcon'
    }
};
