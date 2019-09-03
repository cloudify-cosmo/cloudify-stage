/**
 * Created by kinneretzin on 27/03/2017.
 */

const Config = require('../config');

exports.command = function(asUser) {
    return this.page
        .login()
        .navigate()
        .waitForSplashPageNotVisible()
        .waitForElementVisible('@usernameField')
        .resetValue('@usernameField')
        .setElementValue('@usernameField', asUser ? Config.user : Config.admin)
        .resetValue('@passwordField')
        .setElementValue('@passwordField', asUser ? Config.pass : Config.adminPass)
        .clickElement('@submitButton')
        .waitForSplashPageNotVisible()
        .waitForElementVisible('@managerData');
};
