import express from 'express';
import type { Response } from 'express';
import * as TemplatesHandler from '../handler/templates/TemplatesHandler';
import * as PagesHandler from '../handler/templates/PagesHandler';
import * as PageGroupsHandler from '../handler/templates/PageGroupsHandler';
import { getTokenFromCookies } from '../utils';
import type {
    GetPageGroupsResponse,
    GetPagesResponse,
    GetSelectTemplateQueryParams,
    GetSelectTemplateResponse,
    GetTemplatesResponse,
    PostPageGroupsRequestBody,
    PostPagesRequestBody,
    PostTemplatesRequestBody,
    PutPagesRequestBody,
    PutTemplatesRequestBody,
    TemplatesGenericReponse
} from './Templates.types';

const router = express.Router();

router.use(express.json());

router.get('/', (_req, res: Response<GetTemplatesResponse>, next) => {
    TemplatesHandler.listTemplates()
        .then(templates => res.send(templates))
        .catch(next);
});

router.post<never, TemplatesGenericReponse, PostTemplatesRequestBody>('/', (req, res, next) => {
    TemplatesHandler.createTemplate(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put<never, TemplatesGenericReponse, PutTemplatesRequestBody>('/', (req, res, next) => {
    TemplatesHandler.updateTemplate(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/:templateId', (req, res: Response<TemplatesGenericReponse>, next) => {
    TemplatesHandler.deleteTemplate(req.params.templateId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.get<never, GetSelectTemplateResponse, any, GetSelectTemplateQueryParams>('/select', (req, res, next) => {
    TemplatesHandler.selectTemplate(
        req.user!.role,
        req.user!.group_system_roles,
        req.user!.tenants,
        req.query.tenant,
        getTokenFromCookies(req)
    )
        .then(template => res.send(template))
        .catch(next);
});

router.get('/page-groups', (_req, res: Response<GetPageGroupsResponse>, next) => {
    try {
        res.send(PageGroupsHandler.listPageGroups());
    } catch (err) {
        next(err);
    }
});

router.post<never, TemplatesGenericReponse, PostPageGroupsRequestBody>('/page-groups', (req, res, next) => {
    PageGroupsHandler.createPageGroup(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put('/page-groups/:groupId', (req, res: Response<TemplatesGenericReponse>, next) => {
    PageGroupsHandler.updatePageGroup(req.user!.username, req.params.groupId, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/page-groups/:groupId', (req, res: Response<TemplatesGenericReponse>, next) => {
    PageGroupsHandler.deletePageGroup(req.params.groupId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.get('/pages', (_req, res: Response<GetPagesResponse>, next) => {
    PagesHandler.listPages()
        .then(pages => res.send(pages))
        .catch(next);
});

router.post<never, TemplatesGenericReponse, PostPagesRequestBody>('/pages', (req, res, next) => {
    PagesHandler.createPage(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.put<never, TemplatesGenericReponse, PutPagesRequestBody>('/pages', (req, res, next) => {
    PagesHandler.updatePage(req.user!.username, req.body)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

router.delete('/pages/:pageId', (req, res: Response<TemplatesGenericReponse>, next) => {
    PagesHandler.deletePage(req.params.pageId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

export default router;
