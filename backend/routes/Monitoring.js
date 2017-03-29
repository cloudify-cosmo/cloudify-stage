/**
 * Created by kinneretzin on 28/02/2017.
 */

var express = require('express');
var influx = require('influx');
var config = require('../config').get();
var _ = require('lodash');

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
 * End point to gets a list of available metrics per deployment
 *
 * It uses the query 'list series' and filter it by the deploymentId
 *
 * The result is parsed like a graph with time 0
 * it looks like this:
 * [
 * {
 *     "name": "list_series_result",
 *     "columns": [
 *         "time",
 *         "name"
 *     ],
 *     "points": [
 *         [
 *             0,
 *             "kinneret.vm.vm_7mmzx9.cpu_cpu0_guest"
 *         ],
 *         [
 *             0,
 *             "kinneret.vm.vm_7mmzx9.cpu_cpu0_guest_nice"
 *         ],
 *        ...
 *    ]
 * }
 * ]
 *
 * So we parse out only the metric (after the last dot)
 */
router.get('/metrics/:managerIp/:deploymentId',function (req, res,next) {
    getClient(req.params.managerIp)
        .query('list series /'+req.params.deploymentId+'..*/i', function(err,response){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send({message: err.message})
            } else {
                res.send(_.map(response[0].points,function(point){
                    return point[1].substring(point[1].lastIndexOf('.')+1);
                }));
            }
        } );
});

/**
 * Return a specific metrics graph for a deployment
 * The query looks like this:
 * select  mean(value) from /kinneret\..*\.cpu_total_system/  where time > now() - 15m group by time(10)  order asc
 *
 *
 * The user can pass 3 query params for time filtering -
 *    from - the from time
 *    to - the to time
 *    timeGroup - group the results by time
 */
router.get('/byMetric/:managerIp/:deploymentId/:metric',function(req,res,next){
    var fromTime = req.query.from ||  'now() - 15m';
    var toTime = req.query.to || 'now()';
    var timeGrouping = req.query.timeGroup || 10;

    var query = 'select mean(value) from /'+req.params.deploymentId+'\\..*\\.'+req.params.metric+'/  ' +
                'where time > '+fromTime+' and time < '+toTime+' group by time('+timeGrouping+')  order asc';

    logger.debug('Query: ',query);

    getClient(req.params.managerIp)
        .query(query, function(err,response){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send({message: err.message})
            } else {
                res.send(response);
            }
        } );
});

router.get('/query/:managerIp',function (req, res,next) {
    logger.debug('Running query',req.query.q);
    getClient(req.params.managerIp)
        .query(req.query.q, function(err,results){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send(err.message)
            } else {
                res.send(results);
            }
        } );

});

module.exports = router;
