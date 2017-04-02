/**
 * Created by kinneretzin on 27/03/2017.
 */

var Config = require('../config.json');

module.exports =  function(client) {
    var page = client.page.login();

    return page.navigate()
        .waitForElementVisible('@ipField', 2000)
        .clearValue('@ipField')
        .setValue('@ipField', Config.managerIp)
        .setValue('@usernameField', Config.user)
        .setValue('@passwordField', Config.pass)
        .click('@submitButton')
        .waitForElementVisible('@managerData',5000);
}
