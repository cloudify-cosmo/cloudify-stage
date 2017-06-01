/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config.json');

exports.command =  function(asUser) {
    return this.page.login()
        .navigate()
        .waitForElementVisible('@usernameField')
        .setValue('@usernameField', asUser ? Config.user : Config.admin)
        .setValue('@passwordField', asUser ? Config.pass: Config.adminPass)
        .waitForElementNotVisible('@splashPage')
        .click('@submitButton')
        .waitForElementVisible('@managerData');
}
