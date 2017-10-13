/**
 * Created by kinneretzin on 28/02/2017.
 */

var express = require('express');
var influx = require('influx-old');
var influxNew = require('influx');
var config = require('../config').get();
var _ = require('lodash');
var passport = require('passport');
var bodyParser = require('body-parser');

var router = express.Router();
var logger = require('log4js').getLogger('MonitoringRouter');

router.use(passport.authenticate('token', {session: false}));
router.use(bodyParser.json());

const defaultTimeRange = 'time > now() - 15m AND time < now() group by time(1m)';

function getClient() {
    var options = {
        host: config.app.influx.ip,
        port: config.app.influx.port,
        username: config.app.influx.user,
        password: config.app.influx.password,
        database: config.app.influx.database,
        requestTimeout: config.app.influx.timeout
    };

    logger.debug('Connecting to influx using ', options);
    return influx(options);
}

function getClientNew() {
    var options = {
        host: config.app.influx.ip,
        port: config.app.influx.port,
        username: config.app.influx.user,
        password: config.app.influx.password,
        database: config.app.influx.database,
        timeout: config.app.influx.timeout
    };

    logger.debug('Connecting to influx using ', options);
    return new influxNew.InfluxDB(options);
}

function _isValidQuery(string) {
    const lowerCase = string.toLowerCase().slice(0, -1);
    const pattern = /;|drop\s|update\s|delete\s/;
    return !pattern.test(lowerCase);
}

function _sanitizeQuery(query) {
    return query.replace(/;/g, '');
}

function _createQuery(query) {
    const qSelect = _sanitizeQuery(query.qSelect);
    const qFrom = _sanitizeQuery(query.qFrom);
    const qWhere = _sanitizeQuery(query.qWhere);

    return ''.concat('SELECT ', qSelect, ' FROM ', qFrom, ' WHERE ', qWhere?qWhere:defaultTimeRange);
}

function _createShowTagValuesQuery(query) {
    const qFrom = _sanitizeQuery(query.qFrom);
    const qWithKey = _sanitizeQuery(query.qWithKey);
    var q = ''.concat('SHOW TAG values FROM ', qFrom, ' WITH KEY',qWithKey);
    if (query.qWhere) {
        const qWhere = _sanitizeQuery(query.qWhere);
        q = q.concat(' WHERE ', qWhere);
    }
    return q;
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
router.get('/metrics/:deploymentId',function (req, res,next) {
    getClient()
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
router.get('/byMetric/:deploymentId/:metrics',function(req,res,next){
    const fromTime = req.query.from ||  'now() - 15m';
    const toTime = req.query.to || 'now()';
    const timeGrouping = req.query.timeGroup || 10;
    const metrics = _.chain(req.params.metrics)
                   .split(',')
                   .map(function(metric) { return `(${metric})`})
                   .join('|');

    const query = 'select mean(value) from /'+req.params.deploymentId+'\\..*\\.('+metrics+')$/ ' +
                'where time > '+fromTime+' and time < '+toTime+' group by time('+timeGrouping+')  order asc';

    logger.debug('Query: ',query);

    getClient()
        .query(query, function(err,response){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send({message: err.message})
            } else {
                res.send(response);
            }
        } );
});

router.get('/query',function (req, res, next) {

    const query = _createQuery(req.query);
    logger.debug('Running query:', query);

    if (!_isValidQuery(query)){
        logger.error('Error: not a valid SELECT query');
        res.status(403).send('Error: not a valid SELECT query');
        return;
    }

    getClient()
        .query(query, function(err,results){
            if (err) {
                logger.error('Error connecting to influxDB', err);
                res.status(500).send(err.message);
            } else {
                res.send(results);
            }
        } );

});


router.get('/new/showTagValues',function (req, res, next) {

    const query = _createShowTagValuesQuery(req.query);
    logger.debug('Running query:', query);

    if (!_isValidQuery(query)){
        logger.error('Error: not a valid SHOW TAG VALUES query');
        res.status(403).send('Error: not a valid SHOW TAG VALUES query');
        return;
    }

    getClientNew()
        .query(query)
        .then(function (results) {
            logger.debug('Influx got result ' + results);
            res.send(results);

        })
        .catch(function (err) {
            logger.error('Error connecting to influxDB', err);
            res.status(500).send(err.message)
        });
});

router.post('/new/query',function (req, res, next) {

    var queries = [];
    var isValid = true;
    logger.debug('body is: ',req.body);
    _.each(req.body,function(queryObj,i){
        var query = _createQuery(queryObj);
        logger.debug('Got query['+i+']:', query);

        if (!_isValidQuery(query)){
            logger.error('Error: not a valid SELECT query');
            res.status(403).send('Error: not a valid SELECT query');
            isValid = false;
            return;
        }

        queries.push(query);
    });

    if (!isValid) return;

    if (_.isEmpty(queries)){
        logger.warn('Got Empty queries list ');
        res.send([]);
        return;
    }

    var queryToRun = _.join(queries,';');

    getClientNew()
        .query(queryToRun)
        .then(function (results) {
            logger.debug('Influx got result ' + results);
            res.send(results);

        })
        .catch(function (err) {
            logger.error('Error connecting to influxDB', err);
            res.status(500).send(err.message)
        });
});

module.exports = router;
