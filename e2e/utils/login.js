/**
 * Created by kinneretzin on 27/03/2017.
 */

module.exports =  function(client) {
    var page = client.page.login();

    return page.navigate()
        .waitForElementVisible('@ipField', 2000)
        .clearValue('@ipField')
        .setValue('@ipField', '10.239.3.79')
        .setValue('@usernameField', 'admin')
        .setValue('@passwordField', 'admin')
        .click('@submitButton')
        .waitForElementVisible('@managerData',5000);
}
