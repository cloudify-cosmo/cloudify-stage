import type { RequestHandler, Response } from 'express';
import express from 'express';
import * as WidgetsHandler from '../handler/widgets/WidgetsHandler';
import { getRBAC, isAuthorized } from '../handler/AuthHandler';
import { getTokenFromCookies } from '../utils';
import type {
    GetWidgetsResponse,
    GetWidgetsUsedResponse,
    PostWidgetsQueryParams,
    PostWidgetsResponse,
    PutWidgetsQueryParams,
    PutWidgetsResponse
} from './Widgets.types';

const router = express.Router();

router.use(express.json());

router.get('/', (_req, res: Response<GetWidgetsResponse>, next) => {
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

router.post<never, PostWidgetsResponse, any, PostWidgetsQueryParams>(
    '/',
    validateInstallWidgetsPermission,
    (req, res, next) => {
        WidgetsHandler.installWidget(req.query.url, req.user!.username, req)
            .then(data => res.send(data))
            .catch(next);
    }
);

router.put<never, PutWidgetsResponse, any, PutWidgetsQueryParams>(
    '/',
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
        .then(() => res.status(200).end())
        .catch(next);
});

export default router;
