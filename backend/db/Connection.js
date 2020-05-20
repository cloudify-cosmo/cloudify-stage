/**
 * Created by kinneretzin on 13/02/2017.
 */
const Sequelize = require('sequelize');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const config = require('../config').get();

// var logger = require('../handler/LoggerHandler').getLogger('DBConnection');

const excludes = ['.', 'Connection.js', 'types'];

const options = _.merge(
    {
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: false
        // logging: (message) => logger.debug(message)
    },
    config.app.db.options
);

if (options.dialectOptions.ssl) {
    options.dialectOptions.ssl.ca = fs.readFileSync(options.dialectOptions.ssl.ca, { encoding: 'utf8' });
    if (options.dialectOptions.ssl.cert) {
        // If the cert is provided, the key will also be provided by the installer.
        options.dialectOptions.ssl.cert = fs.readFileSync(options.dialectOptions.ssl.cert, { encoding: 'utf8' });
        options.dialectOptions.ssl.key = fs.readFileSync(options.dialectOptions.ssl.key, { encoding: 'utf8' });
    }
}

const sequelize = new Sequelize(config.app.db.url, options);

const db = {};

fs.readdirSync(__dirname)
    .filter(file => _.indexOf(excludes, file) < 0)
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
