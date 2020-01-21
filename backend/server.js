/**
 * Created by kinneretzin on 05/12/2016.
 */

const path = require('path');
const expressStaticGzip = require('express-static-gzip');
const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const _ = require('lodash');

// Initialize logger
const LoggerHandler = require('./handler/LoggerHandler');

const logger = LoggerHandler.getLogger('Server');

const config = require('./config');
const Consts = require('./consts');

// Initialize the DB connection
require('./db/Connection');

const getCookieStrategy = require('./auth/CookieStrategy');
const getTokenStrategy = require('./auth/TokenStrategy');
const getSamlStrategy = require('./auth/SamlStrategy');
const samlSetup = require('./samlSetup');

const Auth = require('./routes/Auth');

const ServerSettings = require('./serverSettings');

ServerSettings.init();

const ServerProxy = require('./routes/ServerProxy');
const UserApp = require('./routes/UserApp');
const Applications = require('./routes/Applications');
const BlueprintAdditions = require('./routes/BlueprintAdditions');
const clientConfig = require('./routes/ClientConfig');
const SourceBrowser = require('./routes/SourceBrowser');
const GitHub = require('./routes/GitHub');
const External = require('./routes/External');
const Style = require('./routes/Style');
const Widgets = require('./routes/Widgets');
const Templates = require('./routes/Templates');
const Tours = require('./routes/Tours');
const WidgetBackend = require('./routes/WidgetBackend');
const File = require('./routes/File');
const Plugins = require('./routes/Plugins');

const ToursHandler = require('./handler/ToursHandler');
const WidgetHandler = require('./handler/WidgetHandler');
const TemplateHandler = require('./handler/TemplateHandler');

const contextPath = Consts.CONTEXT_PATH;
const oldContextPath = '/stage';

const app = express();

app.use(morgan('short', { stream: LoggerHandler.getStream('Express') }));

app.all('/', function(request, response) {
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
    expressStaticGzip(path.resolve(__dirname, '../dist/appData'), { enableBrotli: true, indexFromEmptyFile: false })
);

app.use(
    `${contextPath}/userData`,
    passport.authenticate('cookie', { session: false }),
    expressStaticGzip(
        path.resolve(__dirname, process.env.NODE_ENV === 'development' ? '../userData' : '../dist/userData'),
        {
            enableBrotli: true,
            indexFromEmptyFile: false
        }
    )
);

// Serving static content only in development mode. In production mode it is served by Nginx.
if (process.env.LOCAL_ENV === 'true') {
    app.use(
        `${contextPath}/static`,
        expressStaticGzip(path.resolve(__dirname, '../dist/static'), { enableBrotli: true, indexFromEmptyFile: false })
    );
}

// API Routes
app.use(`${contextPath}/sp`, ServerProxy);
app.use(`${contextPath}/auth`, Auth);
app.use(`${contextPath}/ua`, UserApp);
app.use(`${contextPath}/applications`, Applications);
app.use(`${contextPath}/source`, SourceBrowser);
app.use(`${contextPath}/ba`, BlueprintAdditions);
app.use(`${contextPath}/style`, Style);
app.use(`${contextPath}/widgets`, Widgets);
app.use(`${contextPath}/templates`, Templates);
app.use(`${contextPath}/tours`, Tours);
app.use(`${contextPath}/clientConfig`, clientConfig);
app.use(`${contextPath}/github`, GitHub);
app.use(`${contextPath}/external`, External);
app.use(`${contextPath}/file`, File);
app.use(`${contextPath}/config`, function(req, res) {
    res.send(config.getForClient(ServerSettings.settings.mode));
});
app.use(`${contextPath}/wb`, WidgetBackend);
app.use(`${contextPath}/plugins`, Plugins);

// Redirect URLs with old context path (/stage)
app.use([oldContextPath, `${oldContextPath}/*`], function(request, response) {
    const pathWithoutOldContextPath = request.originalUrl.replace(new RegExp(`^${oldContextPath}`), '');
    const redirectUrl = `${contextPath}${pathWithoutOldContextPath}`;
    logger.info(`Old base url detected: "${request.originalUrl}". Redirecting to "${redirectUrl}".`);

    response.redirect(redirectUrl);
});

// Serving index.html for routes defined in frontend - react-router (e.g. /console/login, /console/page/dashboard)
app.get('*', function(request, response) {
    logger.info(`URL: "${request.originalUrl}". Sending index.html file.`);
    response.sendFile(path.resolve(__dirname, '../dist/static', 'index.html'));
});

// Error handling
app.use(function(err, req, res, next) {
    logger.error('Error has occured ', err);

    let { message } = err;
    if (err.status === 500) {
        message = 'The server is temporarily unavailable';
    }

    res.status(err.status || 404).send({ message: message || err });
});

const startServer = instanceNumber => {
    app.listen(Consts.SERVER_PORT, Consts.SERVER_HOST, function() {
        logger.info(`Server (${String(instanceNumber || 0)}) started in mode ${ServerSettings.settings.mode}`);
        if (process.env.NODE_ENV === 'development') {
            logger.info('Server started for development');
        }
        logger.info(`Stage runs on ${Consts.SERVER_HOST}:${Consts.SERVER_PORT}!`);
    });
};

const instanceNumber = parseInt(process.env.NODE_APP_INSTANCE);
if (_.isNaN(instanceNumber) || instanceNumber === 0) {
    // Application data (widgets, templates) initialization only in the first instance
    Promise.all([ToursHandler.init(), WidgetHandler.init(), TemplateHandler.init()])
        .then(() => {
            logger.info('Tours, widgets and templates data initialized successfully.');
            startServer(instanceNumber);
        })
        .catch(error => {
            logger.error(`Error during tours, widgets and templates data initialization: ${error}`);
            process.exit(1);
        });
} else {
    ToursHandler.init()
        .then(() => {
            logger.info('Tours data initialized successfully.');
            startServer(instanceNumber);
        })
        .catch(error => {
            logger.error(`Error during tours data initialization: ${error}`);
            process.exit(1);
        });
}
