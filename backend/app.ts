// @ts-nocheck File not migrated fully to TS
import fs from 'fs';
import path from 'path';
import expressStaticGzip from 'express-static-gzip';
import express from 'express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import type { Router } from 'express';

import { getConfig, getClientConfig } from './config';
import { CONTEXT_PATH } from './consts';
import LoggerHandler from './handler/LoggerHandler';
import { getMode } from './serverSettings';
import { getResourcePath } from './utils';

import getCookieStrategy from './auth/CookieStrategy';
import getTokenStrategy from './auth/TokenStrategy';
import getSamlStrategy from './auth/SamlStrategy';
import { authenticateWithCookie, authenticateWithToken } from './auth/AuthMiddlewares';
import validateSamlConfig from './samlSetup';
import Auth from './routes/Auth';

import Applications from './routes/Applications';
import BlueprintAdditions from './routes/BlueprintAdditions';
import BlueprintUserData from './routes/BlueprintUserData';
import ClientConfig from './routes/ClientConfig';
import ContactDetails from './routes/ContactDetails';
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
    authenticateWithCookie,
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
    authenticateWithCookie,
    expressStaticGzip(getResourcePath('', true), {
        indexFromEmptyFile: false
    })
);
// API Routes with authentication
const authenticatedApiRoutes: Record<string, Router> = {
    applications: Applications,
    bud: BlueprintUserData,
    clientConfig: ClientConfig,
    contactDetails: ContactDetails,
    file: File,
    filters: Filters,
    github: GitHub,
    plugins: Plugins,
    source: SourceBrowser,
    templates: Templates,
    terraform: Terraform,
    ua: UserApp,
    wb: WidgetBackend,
    widgets: Widgets
};
Object.entries(authenticatedApiRoutes).forEach(([routePath, router]) =>
    app.use(`${contextPath}/${routePath}`, authenticateWithToken, router)
);

// TODO(RD-3827): All API routes should be authenticated
// API Routes with authentication only for some endpoints (see routers for details)
app.use(`${contextPath}/auth`, Auth);
app.use(`${contextPath}/ba`, BlueprintAdditions);

// API Routes without authentication
const Config = (req, res) => {
    res.send(getClientConfig(getMode()));
};
app.use(`${contextPath}/config`, Config); // used to get white-labelling configuration required e.g. in Login page
app.use(`${contextPath}/external`, External); // used to get images for blueprints and plugins
app.use(`${contextPath}/style`, Style); // used to get stylesheet, e.g. in Login page
app.use(`${contextPath}/sp`, ServerProxy); // at least /sp/tokens should not require authentication, maybe more
app.use(`${contextPath}/maps`, Maps);

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
