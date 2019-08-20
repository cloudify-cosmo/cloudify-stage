/**
 * Created by kinneretzin on 13/02/2017.
 */
var config = require('../config').get();
var Sequelize = require('sequelize');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');

// var logger = require('../handler/LoggerHandler').getLogger('DBConnection');

var excludes = ['.', 'Connection.js', 'types'];

var options = _.merge({
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        operatorsAliases: false,
        logging: false
        // logging: (message) => logger.debug(message)
    },config.app.db.options);

if(options.dialectOptions.ssl) {
    options.dialectOptions.ssl.ca = fs.readFileSync(
        options.dialectOptions.ssl.ca,
        {encoding: 'utf8'}
    );
}

var sequelize = new Sequelize(config.app.db.url,options);

var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return _.indexOf(excludes, file) < 0;
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



