const fs = require('fs');
const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const config = require('./config');
const Consts = require('./consts');
const LoggerHandler = require('./handler/LoggerHandler');
const ServerSettings = require('./serverSettings');
const { getResourcePath } = require('./utils');

const getCookieStrategy = require('./auth/CookieStrategy');
const getTokenStrategy = require('./auth/TokenStrategy');
const getSamlStrategy = require('./auth/SamlStrategy');
const samlSetup = require('./samlSetup');
const Auth = require('./routes/Auth');

const Applications = require('./routes/Applications');
const BlueprintAdditions = require('./routes/BlueprintAdditions');
const BlueprintUserData = require('./routes/BlueprintUserData');
const ClientConfig = require('./routes/ClientConfig');
const External = require('./routes/External');
const File = require('./routes/File');
const GitHub = require('./routes/GitHub');
const Maps = require('./routes/Maps');
const Plugins = require('./routes/Plugins');
const ServerProxy = require('./routes/ServerProxy');
const SourceBrowser = require('./routes/SourceBrowser');
const Style = require('./routes/Style');
const Templates = require('./routes/Templates');
const UserApp = require('./routes/UserApp');
const WidgetBackend = require('./routes/WidgetBackend');
const Widgets = require('./routes/Widgets');
const Filters = require('./routes/Filters');

const logger = LoggerHandler.getLogger('App');
const contextPath = Consts.CONTEXT_PATH;
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

const samlConfig = config.get().app.saml;
if (samlConfig.enabled) {
    samlSetup.validate(samlConfig);
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

// API Routes
app.use(`${contextPath}/sp`, ServerProxy);
app.use(`${contextPath}/auth`, Auth);
app.use(`${contextPath}/ua`, UserApp);
app.use(`${contextPath}/applications`, Applications);
app.use(`${contextPath}/source`, SourceBrowser);
app.use(`${contextPath}/ba`, BlueprintAdditions);
app.use(`${contextPath}/bud`, BlueprintUserData);
app.use(`${contextPath}/style`, Style);
app.use(`${contextPath}/widgets`, Widgets);
app.use(`${contextPath}/filters`, Filters);
app.use(`${contextPath}/templates`, Templates);
app.use(`${contextPath}/clientConfig`, ClientConfig);
app.use(`${contextPath}/github`, GitHub);
app.use(`${contextPath}/external`, External);
app.use(`${contextPath}/file`, File);
app.use(`${contextPath}/config`, (req, res) => {
    res.send(config.getForClient(ServerSettings.settings.mode));
});
app.use(`${contextPath}/wb`, WidgetBackend);
app.use(`${contextPath}/plugins`, Plugins);
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

module.exports = app;
