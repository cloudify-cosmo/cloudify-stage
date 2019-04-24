/**
 * Created by pposel on 25/01/2017.
 */

var config = require('./config.json');
var _ = require('lodash');

try {
    var me = require('../conf/me.json');
    _.merge(config, me.e2e);
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}

module.exports = config;
