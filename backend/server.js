'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */

let path = require('path');
var fs = require('fs');

var config = require('./config');

// Initialize log4js
var log4js = require('log4js');
var log4jsConfig = config.get().log4jsConfig;
var LoggerHandler = require('./handler/LoggerHandler');
LoggerHandler.init(log4jsConfig);

// Initialize the DB connection
var db = require('./db/Connection');

var express = require('express');
var ServerSettings = require('./serverSettings');
var ServerProxy = require('./routes/ServerProxy');
var UserApp = require('./routes/UserApp');
var Applications = require('./routes/Applications');
var BlueprintAdditions = require('./routes/BlueprintAdditions');
var Monitoring = require('./routes/Monitoring');
var clientConfig = require('./routes/ClientConfig');
var SourceBrowser = require('./routes/SourceBrowser');
var GitHub = require('./routes/GitHub');
var Style = require('./routes/Style');
var Widgets = require('./routes/Widgets');

var logger = log4js.getLogger('Server');

ServerSettings.init();

logger.info('Server started in mode '+ServerSettings.settings.mode);

var contextPath = config.get().app.contextPath;

var app = express();

app.use(contextPath, express.static(path.resolve(__dirname , '../dist'),{index: 'index.html'}));
app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'INFO'}));

// For dev purposes
app.use(contextPath, (req,res,next) => {
    // Setting access control allow origin headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,authentication-token,tenant');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

// Routes
app.use(contextPath +'/sp',ServerProxy);
app.use(contextPath +'/ua',UserApp);
app.use(contextPath +'/applications',Applications);
app.use(contextPath +'/source',SourceBrowser);
app.use(contextPath +'/ba',BlueprintAdditions);
app.use(contextPath +'/monitor',Monitoring);
app.use(contextPath +'/style',Style);
app.use(contextPath +'/widgets',Widgets);
app.use(contextPath +'/clientConfig',clientConfig);
app.use(contextPath +'/github',GitHub);
app.use(contextPath +'/config',function(req,res){
    res.send(config.getForClient(ServerSettings.settings.mode));
});

// BrowserHistory code
app.get('*',function (request, response){
    response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

app.listen(8088, function () {
    logger.info('Stage runs on port 8088!');
});

//Error handling
app.use(function(err, req, res, next) {
    logger.error('Error has occured ', err);
    res.status(err.status || 404).send({message: err.message || err});
});
