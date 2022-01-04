// @ts-nocheck File not migrated fully to TS
import fs from 'fs';
import path from 'path';
import expressStaticGzip from 'express-static-gzip';
import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { getConfig, getClientConfig } from './config';
import { CONTEXT_PATH } from './consts';
import LoggerHandler from './handler/LoggerHandler';
import { getMode } from './serverSettings';
import { getResourcePath } from './utils';

import getCookieStrategy from './auth/CookieStrategy';
import getTokenStrategy from './auth/TokenStrategy';
import getSamlStrategy from './auth/SamlStrategy';
import validateSamlConfig from './samlSetup';
import Auth from './routes/Auth';

import Applications from './routes/Applications';
import BlueprintAdditions from './routes/BlueprintAdditions';
import BlueprintUserData from './routes/BlueprintUserData';
import ClientConfig from './routes/ClientConfig';
import External from './routes/External';
import File from './routes/File';
import GitHub from './routes/GitHub';
import Maps from './routes/Maps';
import Plugins from './routes/Plugins';
import ServerProxy from './routes/ServerProxy';
import SourceBrowser from './routes/SourceBrowser';
import Style from './routes/Style';
import Templates from './routes/Templates';
import Terraform from './routes/Terraform';
import UserApp from './routes/UserApp';
import WidgetBackend from './routes/WidgetBackend';
import Widgets from './routes/Widgets';
import Filters from './routes/Filters';

const logger = LoggerHandler.getLogger('App');
const contextPath = CONTEXT_PATH;
const oldContextPath = '/stage';
const app = express();

app.use(morgan('short', { stream: LoggerHandler.getStream('Express') }));

app.all('/', (request, response) => {
    logger.info(`Redirecting to "${contextPath}".`);
    response.redirect(contextPath);
});

// For dev purposes
app.use(contextPath, (req, res, next) => {
    // Setting access control allow origin headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type,authorization,authentication-token,tenant'
    );
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

const samlConfig = getConfig().app.saml;
if (samlConfig.enabled) {
    validateSamlConfig(samlConfig);
    passport.use(getSamlStrategy());
}

passport.use(getTokenStrategy());
passport.use(getCookieStrategy());
app.use(cookieParser());
app.use(passport.initialize());

// Static Routes
app.use(
    `${contextPath}/appData`,
    passport.authenticate('cookie', { session: false }),
    expressStaticGzip(path.resolve(__dirname, '../dist/appData'), { indexFromEmptyFile: false })
);

const translationsOverrides = 'overrides.json';
app.use(`${contextPath}/userData/${translationsOverrides}`, (req, res) => {
    const overridesPath = getResourcePath(translationsOverrides, true);
    if (fs.existsSync(overridesPath)) res.sendFile(overridesPath);
    else res.send({});
});

app.use(
    `${contextPath}/userData`,
    passport.authenticate('cookie', { session: false }),
    expressStaticGzip(getResourcePath('', true), {
        indexFromEmptyFile: false
    })
);

// API Routes (with authentication)
app.use(`${contextPath}/applications`, passport.authenticate('cookie', { session: false }), Applications);
app.use(`${contextPath}/ba`, passport.authenticate('cookie', { session: false }), BlueprintAdditions);
app.use(`${contextPath}/bud`, passport.authenticate('cookie', { session: false }), BlueprintUserData);
app.use(`${contextPath}/clientConfig`, passport.authenticate('cookie', { session: false }), ClientConfig);
app.use(`${contextPath}/external`, passport.authenticate('cookie', { session: false }), External);
app.use(`${contextPath}/file`, passport.authenticate('cookie', { session: false }), File);
app.use(`${contextPath}/filters`, passport.authenticate('cookie', { session: false }), Filters);
app.use(`${contextPath}/github`, passport.authenticate('cookie', { session: false }), GitHub);
app.use(`${contextPath}/maps`, passport.authenticate('cookie', { session: false }), Maps);
app.use(`${contextPath}/plugins`, passport.authenticate('cookie', { session: false }), Plugins);
app.use(`${contextPath}/source`, passport.authenticate('cookie', { session: false }), SourceBrowser);
app.use(`${contextPath}/templates`, passport.authenticate('cookie', { session: false }), Templates);
app.use(`${contextPath}/terraform`, passport.authenticate('cookie', { session: false }), Terraform);
app.use(`${contextPath}/ua`, passport.authenticate('cookie', { session: false }), UserApp);
app.use(`${contextPath}/wb`, passport.authenticate('cookie', { session: false }), WidgetBackend);
app.use(`${contextPath}/widgets`, passport.authenticate('cookie', { session: false }), Widgets);

// API Routes (without authentication)
app.use(`${contextPath}/auth`, Auth);
app.use(`${contextPath}/config`, (req, res) => {
    res.send(getClientConfig(getMode()));
});
app.use(`${contextPath}/style`, Style);
app.use(`${contextPath}/sp`, ServerProxy);

// Redirect URLs with old context path (/stage)
app.use([oldContextPath, `${oldContextPath}/*`], (request, response) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const pathWithoutOldContextPath = request.originalUrl.replace(new RegExp(`^${oldContextPath}`), '');
    const redirectUrl = `${contextPath}${pathWithoutOldContextPath}`;
    logger.info(`Old base url detected: "${request.originalUrl}". Redirecting to "${redirectUrl}".`);

    response.redirect(redirectUrl);
});

// Serving index.html for routes defined in frontend - react-router (e.g. /console/login, /console/page/dashboard)
app.get('*', (request, response) => {
    logger.info(`URL: "${request.originalUrl}". Sending index.html file.`);
    response.sendFile(path.resolve(__dirname, '../dist/static', 'index.html'));
});

/**
 * Error handling
 * NOTE: error handlers must have 4 parameters, even if the last one is unused
 * @see https://expressjs.com/en/guide/error-handling.html
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    logger.error('Error has occured ', err);

    let { message } = err;
    if (err.status === 500) {
        message = 'The server is temporarily unavailable';
    }

    res.status(err.status || 404).send({ message: message || err });
});

export default app;
