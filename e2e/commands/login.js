/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config');

exports.command =  function(asUser) {
    return this.page.login()
        .navigate()
        .waitForElementNotVisible('@splashPage')
        .waitForElementVisible('@usernameField')
        .setValue('@usernameField', asUser ? Config.user : Config.admin)
        .setValue('@passwordField', asUser ? Config.pass: Config.adminPass)
        .clickElement('@submitButton')
        .waitForElementVisible('@managerData');
}