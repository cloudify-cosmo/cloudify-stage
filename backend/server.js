'use strict';
/**
 * Created by kinneretzin on 05/12/2016.
 */

var express = require('express');
let path = require('path');
var app = express();

var ServerProxy = require('./ServerProxy');

app.use(express.static(path.resolve(__dirname , "../dist")));

app.use('/sp',ServerProxy);

// BrowserHistory code
app.get('*',function (request, response){
    response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

app.listen(8088, function () {
    console.log('Stage runs on port 8088!');
});