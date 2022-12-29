import type { Response } from 'express';
import express from 'express';
import * as TemplatesHandler from '../handler/templates/TemplatesHandler';
import * as PagesHandler from '../handler/templates/PagesHandler';
import * as PageGroupsHandler from '../handler/templates/PageGroupsHandler';
import { getTokenFromCookies } from '../utils';
import type {
    GetInitialTemplateIdResponse,
    GetPageGroupsResponse,
    GetPagesResponse,
    GetTemplatesResponse,
    PostPageGroupsRequestBody,
    PostPagesRequestBody,
    PostTemplatesRequestBody,
    PutPagesRequestBody,
    PutTemplatesRequestBody
} from './Templates.types';

const router = express.Router();

router.use(express.json());

router.get('/', (_req, res: Response<GetTemplatesResponse>, next) => {
    TemplatesHandler.listTemplates()
        .then(templates => res.send(templates))
        .catch(next);
});

router.post<never, never, PostTemplatesRequestBody>('/', (req, res, next) => {
    TemplatesHandler.validateAndCreateTemplate(req.user!.username, req.body)
        .then(() => res.status(200).end())
        .catch(next);
});

router.put<never, never, PutTemplatesRequestBody>('/', (req, res, next) => {
    TemplatesHandler.updateTemplate(req.user!.username, req.body)
        .then(() => res.status(200).end())
        .catch(next);
});

router.delete('/:templateId', (req, res, next) => {
    TemplatesHandler.deleteTemplate(req.params.templateId)
        .then(() => res.status(200).end())
        .catch(next);
});

router.get('/initial', (req, res: Response<GetInitialTemplateIdResponse>, next) => {
    TemplatesHandler.getInitialTemplateId(
        req.user!.role,
        req.user!.group_system_roles,
        req.user!.tenants,
        req.headers.tenant as string,
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

router.post<never, never, PostPageGroupsRequestBody>('/page-groups', (req, res, next) => {
    PageGroupsHandler.createPageGroup(req.user!.username, req.body)
        .then(() => res.status(200).end())
        .catch(next);
});

router.put('/page-groups/:groupId', (req, res, next) => {
    PageGroupsHandler.updatePageGroup(req.user!.username, req.params.groupId, req.body)
        .then(() => res.status(200).end())
        .catch(next);
});

router.delete('/page-groups/:groupId', (req, res, next) => {
    PageGroupsHandler.deletePageGroup(req.params.groupId)
        .then(() => res.status(200).end())
        .catch(next);
});

router.get('/pages', (_req, res: Response<GetPagesResponse>, next) => {
    PagesHandler.listPages()
        .then(pages => res.send(pages))
        .catch(next);
});

router.post<never, never, PostPagesRequestBody>('/pages', (req, res, next) => {
    PagesHandler.validateAndCreatePage(req.user!.username, req.body)
        .then(() => res.status(200).end())
        .catch(next);
});

router.put<never, never, PutPagesRequestBody>('/pages', (req, res, next) => {
    PagesHandler.updatePage(req.user!.username, req.body)
        .then(() => res.status(200).end())
        .catch(next);
});

router.delete('/pages/:pageId', (req, res, next) => {
    PagesHandler.deletePage(req.params.pageId)
        .then(() => res.status(200).end())
        .catch(next);
});

export default router;
