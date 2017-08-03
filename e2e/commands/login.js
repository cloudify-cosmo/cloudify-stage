/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config');

exports.command =  function(asUser) {
    return this.page.login()
        .navigate()
        .waitForElementNotVisible('@splashPage')
        .waitForElementVisible('@usernameField')
        .resetValue('@usernameField')
        .setValue('@usernameField', asUser ? Config.user : Config.admin)
        .resetValue('@passwordField')
        .setValue('@passwordField', asUser ? Config.pass: Config.adminPass)
        .clickElement('@submitButton')
        .waitForElementNotVisible('@splashPage')
        .waitForElementVisible('@managerData');
}