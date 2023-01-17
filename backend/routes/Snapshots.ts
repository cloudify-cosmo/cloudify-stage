import type { Request, RequestHandler } from 'express';
import express from 'express';
import { map, omit, union } from 'lodash';
import { existsSync, writeJson } from 'fs-extra';
// eslint-disable-next-line node/no-missing-import
import type { ParamsDictionary } from 'express-serve-static-core';
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
import { getRBAC, isAuthorized } from '../handler/AuthHandler';

const router = express.Router();

router.use(express.json());

function getSnapshotPermissionValidator(permissionType: 'create' | 'restore'): RequestHandler<never, never> {
    return async (req, res, next) => {
        const rbac = await getRBAC(req.get('Authentication-Token')!);
        const permission = rbac.permissions[`snapshot_${permissionType}`];
        if (!isAuthorized(req.user!, permission)) {
            res.sendStatus(403);
        }
        next();
    };
}

const dataConflictError = { status: 400, message: 'Snapshot data conflicts with already existing data' };

function handleConflictError(err: any) {
    return Promise.reject(err.name === 'SequelizeUniqueConstraintError' ? dataConflictError : err);
}

function defineSnapshotEndpoints<PayloadType>(
    path: string,
    createHandler: RequestHandler<never, PayloadType>,
    restoreHandler: (req: Request<ParamsDictionary, any, PayloadType>) => Promise<unknown>
) {
    router.get(path, getSnapshotPermissionValidator('create'), createHandler);
    router.post(
        path,
        getSnapshotPermissionValidator('restore'),
        (req: Request<ParamsDictionary, any, PayloadType>, res, next) =>
            restoreHandler(req)
                .then(() => res.status(201).end())
                .catch(next)
    );
}

(() => {
    const propertiesToOmit = ['id', 'tenant'] as const;
    type PropertiesToOmit = typeof propertiesToOmit[number];
    type UserAppsSnapshot = Omit<UserAppsAttributes, PropertiesToOmit>[];

    defineSnapshotEndpoints<UserAppsSnapshot>(
        '/ua',
        (req, res, next) => {
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
        },
        req =>
            db
                .sequelize!.transaction(transaction =>
                    Promise.all(
                        req.body.map(userAppSnapshot =>
                            db.UserApps.create<UserAppsInstance>(
                                { ...userAppSnapshot, tenant: req.headers.tenant as string },
                                { transaction }
                            )
                        )
                    )
                )
                .catch(handleConflictError)
    );
})();

const commonPropertiesToOmit = ['custom'] as const;
type CommonPropertiesToOmit = typeof commonPropertiesToOmit[number];

const templatePropertiesToOmit = [...commonPropertiesToOmit, 'name'] as const;
export type TemplatesSnapshot = Omit<Template, typeof templatePropertiesToOmit[number]>[];
defineSnapshotEndpoints<TemplatesSnapshot>(
    '/templates',
    (_req, res, _next) => {
        res.send(getUserTemplates().map(template => omit(template, templatePropertiesToOmit)));
    },
    req =>
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
);

export type PagesSnapshot = Omit<Page, CommonPropertiesToOmit>[];
defineSnapshotEndpoints<PagesSnapshot>(
    '/pages',
    (_req, res, _next) => {
        res.send(getUserPages().map(page => omit(page, commonPropertiesToOmit)));
    },
    req =>
        Promise.all(req.body.map(pageData => checkPageExists(pageData)))
            .catch(message => Promise.reject({ message, status: 400 }))
            .then(() =>
                Promise.all(
                    req.body.map(pageData =>
                        createPage({ ...pageData, ...pageData.data }, pageData.updatedBy, pageData.updatedAt)
                    )
                )
            )
);

export type PageGroupsSnapshot = Omit<PageGroup, CommonPropertiesToOmit>[];
defineSnapshotEndpoints<PageGroupsSnapshot>(
    '/page-groups',
    (_req, res, _next) => {
        res.send(getUserPageGroups().map(pageGroup => omit(pageGroup, commonPropertiesToOmit)));
    },
    req =>
        Promise.all(req.body.map(pageGroupData => checkPageGroupExists(pageGroupData)))
            .catch(message => Promise.reject({ message, status: 400 }))
            .then(() =>
                Promise.all(
                    req.body.map(pageGroupData =>
                        createPageGroup(pageGroupData, pageGroupData.updatedBy, pageGroupData.updatedAt)
                    )
                )
            )
);

defineSnapshotEndpoints(
    '/widgets',
    (_req, res, next) => {
        const snapshot = createUserWidgetsSnapshot(next);
        snapshot.pipe(res);
    },
    restoreUserWidgetsSnapshot
);

(() => {
    const propertiesToOmit = ['id'] as const;
    type PropertiesToOmit = typeof propertiesToOmit[number];
    type BlueprintLayoutsSnapshot = Omit<BlueprintUserDataAttributes, PropertiesToOmit>[];

    defineSnapshotEndpoints<BlueprintLayoutsSnapshot>(
        '/blueprint-layouts',
        (_req, res, next) => {
            db.BlueprintUserData.findAll<BlueprintUserDataInstance>({
                attributes: Object.keys(omit(db.BlueprintUserData.getAttributes(), propertiesToOmit))
            })
                .then(blueprintLayouts => {
                    res.send(blueprintLayouts);
                })
                .catch(next);
        },
        req =>
            db
                .sequelize!.transaction(transaction =>
                    Promise.all(
                        req.body.map(blueprintLayoutSnapshot =>
                            db.BlueprintUserData.create<BlueprintUserDataInstance>(blueprintLayoutSnapshot, {
                                transaction
                            })
                        )
                    )
                )
                .catch(handleConflictError)
    );
})();

(() => {
    const userConfigurationFiles = ['overrides.json', 'userConfig.json'] as const;
    type ConfigurationSnapshot = Partial<Record<typeof userConfigurationFiles[number], any>>;

    defineSnapshotEndpoints<ConfigurationSnapshot>(
        '/configuration',
        (_req, res, _next) => {
            const snapshot: ConfigurationSnapshot = {};
            userConfigurationFiles.forEach(fileName => {
                const filePath = getResourcePath(fileName, true);
                if (existsSync(filePath)) {
                    // eslint-disable-next-line import/no-dynamic-require,global-require
                    snapshot[fileName] = require(filePath);
                }
            });
            res.send(snapshot);
        },
        req => {
            const requestedFiles = Object.keys(req.body);
            if (union(userConfigurationFiles, requestedFiles).length > userConfigurationFiles.length) {
                return Promise.reject({ status: 400, message: 'Unsupported configuration file' });
            }

            const existingFile = requestedFiles.find(fileName => existsSync(getResourcePath(fileName, true)));

            if (existingFile) {
                return Promise.reject(dataConflictError);
            }

            return Promise.all(
                map(req.body, (fileContent, fileName) => writeJson(getResourcePath(fileName, true), fileContent))
            );
        }
    );
})();

export default router;
