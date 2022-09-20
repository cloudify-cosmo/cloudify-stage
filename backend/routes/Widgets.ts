import express from 'express';
import type { RequestHandler, Response } from 'express';
import * as WidgetsHandler from '../handler/WidgetsHandler';
import { getRBAC, isAuthorized } from '../handler/AuthHandler';
import { getTokenFromCookies } from '../utils';
import type {
    GetWidgetsListResponse,
    GetWidgetsUsedResponse,
    PutWidgetsInstallQueryParams,
    PutWidgetsInstallResponse,
    PutWidgetsUpdateQueryParams,
    PutWidgetsUpdateResponse
} from './Widgets.types';

const router = express.Router();

router.use(express.json());

router.get('/list', (_req, res: Response<GetWidgetsListResponse>, next) => {
    WidgetsHandler.listWidgets()
        .then(widgets => res.send(widgets))
        .catch(next);
});

const validateInstallWidgetsPermission: RequestHandler = async (req, res, next) => {
    const permissionId = 'stage_install_widgets';
    const rbac = await getRBAC(getTokenFromCookies(req));
    const permission = rbac.permissions[permissionId];
    if (!isAuthorized(req.user!, permission)) {
        res.sendStatus(403);
    }
    next();
};

router.put<never, PutWidgetsInstallResponse, any, PutWidgetsInstallQueryParams>(
    '/install',
    validateInstallWidgetsPermission,
    (req, res, next) => {
        WidgetsHandler.installWidget(req.query.url, req.user!.username, req)
            .then(data => res.send(data))
            .catch(next);
    }
);

router.put<never, PutWidgetsUpdateResponse, any, PutWidgetsUpdateQueryParams>(
    '/update',
    validateInstallWidgetsPermission,
    (req, res, next) => {
        WidgetsHandler.updateWidget(req.query.id, req.query.url, req)
            .then(data => res.send(data))
            .catch(next);
    }
);

router.get('/:widgetId/used', (req, res: Response<GetWidgetsUsedResponse>, next) => {
    WidgetsHandler.isWidgetUsed(req.params.widgetId)
        .then(result => res.send(result))
        .catch(next);
});

router.delete('/:widgetId', validateInstallWidgetsPermission, (req, res, next) => {
    WidgetsHandler.deleteWidget(req.params.widgetId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

export default router;
