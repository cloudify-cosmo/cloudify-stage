/**
 * Created by pposel on 25/01/2017.
 */

var config = require('./config.json');

var me = null;
try {
    me = require('../conf/me.json');
} catch(err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}
var _ = require('lodash');

_.merge(config, me.e2e);

module.exports = config;
