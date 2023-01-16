import type { Response } from 'express';
import express from 'express';
import { map, omit, union } from 'lodash';
import { existsSync, writeJson } from 'fs-extra';
import { db } from '../db/Connection';
import type { UserAppsInstance } from '../db/models/UserAppsModel';
import type { UserAppsAttributes } from '../db/models/UserAppsModel.types';
import type { Page, PageGroup, Template } from '../handler/templates/types';
import { checkTemplateExists, createTemplate, getUserTemplates } from '../handler/templates/TemplatesHandler';
import { checkPageExists, createPage, getUserPages } from '../handler/templates/PagesHandler';
import { checkPageGroupExists, createPageGroup, getUserPageGroups } from '../handler/templates/PageGroupsHandler';
import { createUserWidgetsSnapshot, restoreUserWidgetsSnapshot } from '../handler/widgets/WidgetsHandler';
import type { BlueprintUserDataInstance } from '../db/models/BlueprintUserDataModel';
import type { BlueprintUserDataAttributes } from '../db/models/BlueprintUserDataModel.types';
import { getResourcePath } from '../utils';

const router = express.Router();

router.use(express.json());

function sendConflictResponse(res: Response) {
    res.status(400).send({ message: 'Snapshot data conflicts with already existing data' });
}

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
                if (err.name === 'SequelizeUniqueConstraintError') sendConflictResponse(res);
                else next(err);
            });
    });
})();

const commonPropertiesToOmit = ['custom'] as const;
type CommonPropertiesToOmit = typeof commonPropertiesToOmit[number];

const templatePropertiesToOmit = [...commonPropertiesToOmit, 'name'] as const;
export type TemplatesSnapshot = Omit<Template, typeof templatePropertiesToOmit[number]>[];
(() => {
    router.get('/templates', (_req, res: Response<TemplatesSnapshot>, _next) => {
        res.send(getUserTemplates().map(template => omit(template, templatePropertiesToOmit)));
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

export type PagesSnapshot = Omit<Page, CommonPropertiesToOmit>[];
(() => {
    router.get('/pages', (_req, res: Response<PagesSnapshot>, _next) => {
        res.send(getUserPages().map(page => omit(page, commonPropertiesToOmit)));
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

export type PageGroupsSnapshot = Omit<PageGroup, CommonPropertiesToOmit>[];
(() => {
    router.get('/page-groups', (_req, res: Response<PageGroupsSnapshot>, _next) => {
        res.send(getUserPageGroups().map(pageGroup => omit(pageGroup, commonPropertiesToOmit)));
    });

    router.post<never, never, PageGroupsSnapshot>('/page-groups', (req, res, next) => {
        Promise.all(req.body.map(pageGroupData => checkPageGroupExists(pageGroupData)))
            .catch(message => Promise.reject({ message, status: 400 }))
            .then(() =>
                Promise.all(
                    req.body.map(pageGroupData =>
                        createPageGroup(pageGroupData, pageGroupData.updatedBy, pageGroupData.updatedAt)
                    )
                )
            )
            .then(() => res.status(201).end())
            .catch(next);
    });
})();

(() => {
    router.get('/widgets', (_req, res, next) => {
        const snapshot = createUserWidgetsSnapshot(next);
        snapshot.pipe(res);
    });

    router.post('/widgets', (req, res, next) => {
        restoreUserWidgetsSnapshot(req)
            .then(() => res.status(201).end())
            .catch(next);
    });
})();

(() => {
    const propertiesToOmit = ['id'] as const;
    type PropertiesToOmit = typeof propertiesToOmit[number];
    type BlueprintLayoutsSnapshot = Omit<BlueprintUserDataAttributes, PropertiesToOmit>[];

    router.get('/blueprint-layouts', (_req, res: Response<BlueprintLayoutsSnapshot>, next) => {
        db.BlueprintUserData.findAll<BlueprintUserDataInstance>({
            attributes: Object.keys(omit(db.BlueprintUserData.getAttributes(), propertiesToOmit))
        })
            .then(blueprintLayouts => {
                res.send(blueprintLayouts);
            })
            .catch(next);
    });

    router.post<never, { message: string }, BlueprintLayoutsSnapshot>('/blueprint-layouts', (req, res, next) => {
        db.sequelize
            ?.transaction(transaction =>
                Promise.all(
                    req.body.map(blueprintLayoutSnapshot =>
                        db.BlueprintUserData.create<BlueprintUserDataInstance>(blueprintLayoutSnapshot, { transaction })
                    )
                )
            )
            .then(() => res.status(201).end())
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError') sendConflictResponse(res);
                else next(err);
            });
    });
})();

(() => {
    const userConfigurationFiles = ['overrides.json', 'userConfig.json'] as const;
    type ConfigurationSnapshot = Partial<Record<typeof userConfigurationFiles[number], any>>;

    router.get('/configuration', (_req, res: Response<ConfigurationSnapshot>, _next) => {
        const snapshot: ConfigurationSnapshot = {};
        userConfigurationFiles.forEach(fileName => {
            const filePath = getResourcePath(fileName, true);
            if (existsSync(filePath)) {
                // eslint-disable-next-line import/no-dynamic-require,global-require
                snapshot[fileName] = require(filePath);
            }
        });
        res.send(snapshot);
    });

    router.post<never, { message: string }, ConfigurationSnapshot>('/configuration', (req, res, next) => {
        const requestedFiles = Object.keys(req.body);
        if (union(userConfigurationFiles, requestedFiles).length > userConfigurationFiles.length) {
            res.status(400).send({ message: 'Unsupported configuration file' });
            return;
        }

        const existingFile = requestedFiles.find(fileName => existsSync(getResourcePath(fileName, true)));

        if (existingFile) {
            sendConflictResponse(res);
            return;
        }

        Promise.all(map(req.body, (fileContent, fileName) => writeJson(getResourcePath(fileName, true), fileContent)))
            .then(() => res.status(201).end())
            .catch(next);
    });
})();

export default router;
