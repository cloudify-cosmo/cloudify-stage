'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */

var log4js = require('log4js');
let path = require('path');
var fs = require('fs');
try {
    fs.mkdirSync('./logs');
} catch (e) {
    if (e.code != 'EEXIST') {
        console.error("Could not set up directory, error was: ", e);
        process.exit(1);
    }
}

log4js.configure(path.resolve(__dirname , "../conf/log4jsConfig.json"));

var express = require('express');
var ServerSettings = require('./serverSettings');
var ServerProxy = require('./ServerProxy');
var config = require('./config');

var logger = log4js.getLogger('Server');

ServerSettings.init();

logger.info('Server started in mode '+ServerSettings.settings.mode);

var app = express();

app.use(express.static(path.resolve(__dirname , "../dist"),{index: 'index.html'}));

app.use('/sp',ServerProxy);
app.use('/config',function(req,res){
    res.send(config.get(ServerSettings.settings.mode));
});

// BrowserHistory code
app.get('*',function (request, response){
    response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

app.listen(8088, function () {
    console.log('Stage runs on port 8088!');
});