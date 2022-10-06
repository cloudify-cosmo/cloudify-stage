import express from 'express';
import type { Response } from 'express';
import { db } from '../db/Connection';

import { getMode } from '../serverSettings';
import type { UserAppsInstance } from '../db/models/UserAppsModel';
import type {
    GetUserAppResponse,
    PostUserAppRequestBody,
    PostUserAppResponse,
    GetUserAppClearPagesRequestQueryParams
} from './UserApp.types';

const router = express.Router();

router.use(express.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', (req, res: Response<GetUserAppResponse>, next) => {
    db.UserApps.findOne<UserAppsInstance>({
        where: {
            username: req.user!.username,
            mode: getMode(),
            tenant: req.headers.tenant
        }
    })
        .then(userApp => {
            res.send(userApp);
        })
        .catch(next);
});

router.post<never, PostUserAppResponse, PostUserAppRequestBody>('/', (req, res, next) => {
    db.UserApps.findOrCreate<UserAppsInstance>({
        where: {
            username: req.user!.username,
            mode: getMode(),
            tenant: req.headers.tenant
        },
        defaults: {
            appData: { pages: [] },
            appDataVersion: req.body.version,
            mode: getMode(),
            tenant: req.headers.tenant as string,
            username: req.user!.username
        }
    })
        .then(([userApp]) =>
            userApp
                .update(
                    { appData: req.body.appData, appDataVersion: req.body.version },
                    { fields: ['appData', 'appDataVersion'] }
                )
                .then(ua => res.send(ua))
        )
        .catch(next);
});

router.get<never, never, never, GetUserAppClearPagesRequestQueryParams>('/clear-pages', (req, res, next) => {
    db.UserApps.findOne<UserAppsInstance>({
        where: {
            username: req.user!.username,
            mode: getMode(),
            tenant: req.query.tenant
        }
    })
        .then(userApp => {
            if (userApp) {
                return userApp.update({ appData: { pages: [] } });
            }
            return Promise.reject('Could not clear pages. Row not found');
        })
        .then(() => res.status(200).end())
        .catch(next);
});

export default router;
