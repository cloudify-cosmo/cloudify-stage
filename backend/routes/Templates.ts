import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as TemplateHandler from '../handler/templates/TemplatesHandler';
import * as PageHandler from '../handler/templates/PagesHandler';
import * as PageGroupsHandler from '../handler/templates/PageGroupsHandler';

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.get('/', (req, res, next) => {
    TemplateHandler.listTemplates()
        .then(templates => res.send(templates))
        .catch(next);
});

router.get('/pages', (req, res, next) => {
    PageHandler.listPages()
        .then(pages => res.send(pages))
        .catch(next);
});

router.get('/page-groups', (req, res, next) => {
    try {
        res.send(PageGroupsHandler.listPageGroups());
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    TemplateHandler.createTemplate(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/', (req, res, next) => {
    TemplateHandler.updateTemplate(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/:templateId', (req, res, next) => {
    TemplateHandler.deleteTemplate(req.params.templateId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.post('/pages', (req, res, next) => {
    PageHandler.createPage(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/pages', (req, res, next) => {
    PageHandler.updatePage(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/pages/:pageId', (req, res, next) => {
    PageHandler.deletePage(req.params.pageId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.get('/select', (req, res, next) => {
    TemplateHandler.selectTemplate(
        req.user!.role,
        req.user!.group_system_roles,
        req.user!.tenants,
        req.query.tenant as string,
        req.headers['authentication-token'] as string
    )
        .then(template => res.send(template))
        .catch(next);
});

export default router;
