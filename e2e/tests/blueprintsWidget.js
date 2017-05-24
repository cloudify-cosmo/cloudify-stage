/**
 * Created by kinneretzin on 02/04/2017.
 */

var Login = require('../utils/login');
var WidgetsUtils = require('../utils/WidgetsHandler');

module.exports = {
    'Blueprints Widget placeholder': function (client) {
        Login(client);
        WidgetsUtils.prepareTestWidget(client,'blueprints');

        client.end();
    }
};

