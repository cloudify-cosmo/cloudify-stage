'use strict';
/**
 * Created by kinneretzin on 27/09/2016.
 */


var express = require('express');
let path = require('path');
var app = express();

app.use(express.static(path.resolve(__dirname , "../dist")));

// BrowserHistory code
app.get('*',function (request, response){
    response.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

app.listen(8088, function () {
    console.log('UI runs on port 8088!');
});

