/**
 * Created by kinneretzin on 28/02/2017.
 */

var express = require('express');
var influx = require('influx');
var config = require('../config').get();

var router = express.Router();
var logger = require('log4js').getLogger('MonitoringRouter');

function getClient(managerIp) {
    var options = {
        host: managerIp,
        port: config.app.influx.port,
        username: config.app.influx.user,
        password: config.app.influx.password,
        database: config.app.influx.database
    };

    logger.debug('Connecting to influx using ', options);
    return influx(options);
}


/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/metrics/:managerIp/:deploymentId',function (req, res,next) {
    getClient(req.params.managerIp)
        .getSeriesNames(config.app.influx.database, function(err,arraySeriesNames){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send({message: 'Error connecting to influx DB'})
            } else {
                res.send(arraySeriesNames);
            }
        } );
});

router.get('/query/:managerIp/:deploymentId',function (req, res,next) {
    logger.debug('Running query',req.query.q);
    getClient(req.params.managerIp)
        .query(req.query.q, function(err,results){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send({message: 'Error connecting to influx DB'})
            } else {
                res.send(results);
            }
        } );

});

module.exports = router;
