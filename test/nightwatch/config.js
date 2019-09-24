/**
 * Created by pposel on 25/01/2017.
 */

const _ = require('lodash');
const config = require('./config.json');

try {
    const me = require('../../conf/me.json');
    _.merge(config, me.e2e);
} catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
    }
}

module.exports = config;
