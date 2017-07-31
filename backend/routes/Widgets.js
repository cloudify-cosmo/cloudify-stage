/**
 * Created by pposel on 10/04/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var WidgetHandler = require('../handler/WidgetHandler');
var _ = require('lodash');
var AuthMiddleware = require('./AuthMiddleware');

var router = express.Router();

router.use(bodyParser.json());

//This request is called before login to the application so we are not able to protect that
router.get('/list', function (req, res, next) {
    WidgetHandler.listWidgets()
        .then(widgets => res.send(widgets))
        .catch(next);
});

router.put('/install', AuthMiddleware, function (req, res, next) {
    WidgetHandler.installWidget(req.query.url, req.query.username, req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/update', AuthMiddleware, function (req, res, next) {
    WidgetHandler.updateWidget(req.query.id, req.query.url, req)
        .then(data => res.send(data))
        .catch(next);
});

router.get('/:widgetId/used', AuthMiddleware, function (req, res, next) {
    WidgetHandler.isWidgetUsed(req.params.widgetId)
        .then(result => res.send(result))
        .catch(next);
});

router.delete('/:widgetId', AuthMiddleware, function (req, res, next) {
    WidgetHandler.deleteWidget(req.params.widgetId)
        .then(response => res.send({status:'ok'}))
        .catch(next);
});

module.exports = router;