/**
 * Created by kinneretzin on 02/04/2017.
 */

module.exports = {
    'Blueprints Widget placeholder': function (client) {
        client.login()
            .prepareTestWidget('blueprints')
            .end();
    }
};

