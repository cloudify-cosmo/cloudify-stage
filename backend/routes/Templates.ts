import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as TemplatesHandler from '../handler/templates/TemplatesHandler';
import * as PagesHandler from '../handler/templates/PagesHandler';
import * as PageGroupsHandler from '../handler/templates/PageGroupsHandler';

const router = express.Router();

router.use(bodyParser.json());

router.get('/', (_req, res, next) => {
    TemplatesHandler.listTemplates()
        .then(templates => res.send(templates))
        .catch(next);
});

router.get('/pages', (_req, res, next) => {
    PagesHandler.listPages()
        .then(pages => res.send(pages))
        .catch(next);
});

router.get('/page-groups', (_req, res, next) => {
    try {
        res.send(PageGroupsHandler.listPageGroups());
    } catch (err) {
        next(err);
    }
});

router.post('/page-groups', (req, res, next) => {
    PageGroupsHandler.createPageGroup(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/page-groups/:groupId', (req, res, next) => {
    PageGroupsHandler.deletePageGroup(req.params.groupId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/page-groups/:groupId', (req, res, next) => {
    PageGroupsHandler.updatePageGroup(req.user!.username, req.params.groupId, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.post('/', (req, res, next) => {
    TemplatesHandler.createTemplate(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/', (req, res, next) => {
    TemplatesHandler.updateTemplate(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/:templateId', (req, res, next) => {
    TemplatesHandler.deleteTemplate(req.params.templateId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.post('/pages', (req, res, next) => {
    PagesHandler.createPage(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/pages', (req, res, next) => {
    PagesHandler.updatePage(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/pages/:pageId', (req, res, next) => {
    PagesHandler.deletePage(req.params.pageId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.get('/select', (req, res, next) => {
    TemplatesHandler.selectTemplate(
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
