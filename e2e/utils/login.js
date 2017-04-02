/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config.json');

module.exports =  function(client,asUser) {
    var page = client.page.login();

    return page.navigate()
        .waitForElementVisible('@ipField', 2000)
        .clearValue('@ipField')
        .setValue('@ipField', Config.managerIp)
        .setValue('@usernameField', asUser ? Config.user : Config.admin)
        .setValue('@passwordField', asUser ? Config.pass: Config.adminPass)
        .click('@submitButton')
        .waitForElementVisible('@managerData',5000);
}
