/**
 * Created by pposel on 10/04/2017.
 */

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const TemplateHandler = require('../handler/TemplateHandler');

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    TemplateHandler.listTemplates()
        .then(templates => res.send(templates))
        .catch(next);
});

router.get('/pages', (req, res, next) => {
    TemplateHandler.listPages()
        .then(pages => res.send(pages))
        .catch(next);
});

router.post('/', (req, res, next) => {
    TemplateHandler.createTemplate(req.user.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/', (req, res, next) => {
    TemplateHandler.updateTemplate(req.user.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/:templateId', (req, res, next) => {
    TemplateHandler.deleteTemplate(req.params.templateId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.post('/pages', (req, res, next) => {
    TemplateHandler.createPage(req.user.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/pages', (req, res, next) => {
    TemplateHandler.updatePage(req.user.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/pages/:pageId', (req, res, next) => {
    TemplateHandler.deletePage(req.params.pageId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.get('/select', (req, res, next) => {
    TemplateHandler.selectTemplate(
        req.user.role,
        req.user.group_system_roles,
        req.user.tenants,
        req.query.tenant,
        req.headers['authentication-token']
    )
        .then(template => res.send(template))
        .catch(next);
});

module.exports = router;
