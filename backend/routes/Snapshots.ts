import type { Response } from 'express';
import express from 'express';
import { omit } from 'lodash';
import { db } from '../db/Connection';
import type { UserAppsInstance } from '../db/models/UserAppsModel';
import type { UserAppsAttributes } from '../db/models/UserAppsModel.types';
import type { Page, Template } from '../handler/templates/types';
import { checkTemplateExists, createTemplate, getUserTemplates } from '../handler/templates/TemplatesHandler';
import { checkPageExists, createPage, getUserPages } from '../handler/templates/PagesHandler';

const router = express.Router();

router.use(express.json());

(function ua() {
    const propertiesToOmit = ['id', 'tenant'] as const;
    type PropertiesToOmit = typeof propertiesToOmit[number];
    type UserAppsSnapshot = Omit<UserAppsAttributes, PropertiesToOmit>[];

    router.get('/ua', (req, res: Response<UserAppsSnapshot>, next) => {
        db.UserApps.findAll<UserAppsInstance>({
            where: {
                tenant: req.headers.tenant
            },
            attributes: Object.keys(omit(db.UserApps.getAttributes(), propertiesToOmit))
        })
            .then(userApps => {
                res.send(userApps);
            })
            .catch(next);
    });

    router.post<never, { message: string }, UserAppsSnapshot>('/ua', (req, res, next) => {
        db.sequelize
            ?.transaction(transaction =>
                Promise.all(
                    req.body.map(userAppSnapshot =>
                        db.UserApps.create<UserAppsInstance>(
                            { ...userAppSnapshot, tenant: req.headers.tenant as string },
                            { transaction }
                        )
                    )
                )
            )
            .then(() => res.status(201).end())
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError')
                    res.status(400).send({ message: 'Snapshot data conflicts with already existing data' });
                else next(err);
            });
    });
})();

(function templates() {
    const propertiesToOmit = ['name', 'custom'] as const;
    type PropertiesToOmit = typeof propertiesToOmit[number];
    type TemplatesSnapshot = Omit<Template, PropertiesToOmit>[];

    router.get('/templates', (_req, res: Response<TemplatesSnapshot>, _next) => {
        res.send(getUserTemplates().map(template => omit(template, propertiesToOmit)));
    });

    router.post<never, never, TemplatesSnapshot>('/templates', (req, res, next) => {
        Promise.all(req.body.map(templateData => checkTemplateExists(templateData)))
            .catch(message => Promise.reject({ message, status: 400 }))
            .then(() =>
                Promise.all(
                    req.body.map(templateData =>
                        createTemplate(
                            { ...templateData, pages: templateData.data.pages },
                            templateData.updatedBy,
                            templateData.updatedAt
                        )
                    )
                )
            )
            .then(() => res.status(201).end())
            .catch(next);
    });
})();

(function pages() {
    const propertiesToOmit = ['custom'] as const;
    type PropertiesToOmit = typeof propertiesToOmit[number];
    type PagesSnapshot = Omit<Page, PropertiesToOmit>[];

    router.get('/pages', (_req, res: Response<PagesSnapshot>, _next) => {
        res.send(getUserPages().map(page => omit(page, propertiesToOmit)));
    });

    router.post<never, never, PagesSnapshot>('/pages', (req, res, next) => {
        Promise.all(req.body.map(pageData => checkPageExists(pageData)))
            .catch(message => Promise.reject({ message, status: 400 }))
            .then(() =>
                Promise.all(
                    req.body.map(pageData =>
                        createPage({ ...pageData, ...pageData.data }, pageData.updatedBy, pageData.updatedAt)
                    )
                )
            )
            .then(() => res.status(201).end())
            .catch(next);
    });
})();

export default router;
