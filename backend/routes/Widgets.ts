// @ts-nocheck File not migrated fully to TS

import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import * as WidgetHandler from '../handler/WidgetHandler';
import { getRBAC, isAuthorized } from '../handler/AuthHandler';

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

router.get('/list', (req, res, next) => {
    WidgetHandler.listWidgets()
        .then(widgets => res.send(widgets))
        .catch(next);
});

async function validateInstallWidgetsPermission(req, res, next) {
    const permissionId = 'stage_install_widgets';
    const rbac = await getRBAC(req.headers['authentication-token']);
    const permission = rbac.permissions[permissionId];
    if (!isAuthorized(req.user, permission)) {
        res.sendStatus(403);
    }
    next();
}

router.put('/install', validateInstallWidgetsPermission, (req, res, next) => {
    WidgetHandler.installWidget(req.query.url, req.user.username, req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/update', validateInstallWidgetsPermission, (req, res, next) => {
    WidgetHandler.updateWidget(req.query.id, req.query.url, req)
        .then(data => res.send(data))
        .catch(next);
});

router.get('/:widgetId/used', (req, res, next) => {
    WidgetHandler.isWidgetUsed(req.params.widgetId)
        .then(result => res.send(result))
        .catch(next);
});

router.delete('/:widgetId', validateInstallWidgetsPermission, (req, res, next) => {
    WidgetHandler.deleteWidget(req.params.widgetId)
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

export default router;
