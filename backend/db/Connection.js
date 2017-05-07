/**
 * Created by kinneretzin on 13/02/2017.
 */
var config = require('../config').get();
var Sequelize = require('sequelize');
var _ = require('lodash');
var fs        = require("fs");
var path      = require("path");

var logger = require('log4js').getLogger('DBConnection');

var options = _.assign({
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        logging: false

        /*function(message) {
            logger.debug(message);
        }*/
    },config.app.db.options);

var sequelize = new Sequelize(config.app.db.url,options);

var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "Connection.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

//Object.keys(db).forEach(function(modelName) {
//    if ("associate" in db[modelName]) {
//        db[modelName].associate(db);
//    }
//});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;



