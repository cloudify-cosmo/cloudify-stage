/**
 * Created by pposel on 10/04/2017.
 */

var express = require('express');
var bodyParser = require('body-parser');
var TemplateHandler = require('../handler/TemplateHandler');
var _ = require('lodash');
var passport = require('passport');

var router = express.Router();

router.use(passport.authenticate('token', {session: false}));
router.use(bodyParser.json());

router.get('/', function (req, res, next) {
    TemplateHandler.listTemplates()
        .then(templates => res.send(templates))
        .catch(next);
});

router.get('/pages', function (req, res, next) {
    TemplateHandler.listPages()
        .then(pages => res.send(pages))
        .catch(next);
});

router.post('/', function (req, res, next) {
    TemplateHandler.createTemplate(req.user.username, req.body)
        .then(() => res.send({status:'ok'}))
        .catch(next);
});

router.put('/', function (req, res, next) {
    TemplateHandler.updateTemplate(req.user.username, req.body)
        .then(() => res.send({status:'ok'}))
        .catch(next);
});

router.delete('/:templateId', function (req, res, next) {
    TemplateHandler.deleteTemplate(req.params.templateId)
        .then(() => res.send({status:'ok'}))
        .catch(next);
});

router.post('/pages', function (req, res, next) {
    TemplateHandler.createPage(req.user.username, req.body)
        .then(() => res.send({status:'ok'}))
        .catch(next);
});

router.put('/pages', function (req, res, next) {
    TemplateHandler.updatePage(req.user.username, req.body)
        .then(() => res.send({status:'ok'}))
        .catch(next);
});

router.delete('/pages/:pageId', function (req, res, next) {
    TemplateHandler.deletePage(req.params.pageId)
        .then(() => res.send({status:'ok'}))
        .catch(next);
});

router.get('/select', function (req, res, next) {
    TemplateHandler.selectTemplate(req.query.mode, req.query.role, req.query.tenant)
        .then(template => res.send(template))
        .catch(next);
});

module.exports = router;