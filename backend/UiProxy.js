'use strict';
/**
 * Created by kinneretzin on 27/09/2016.
 */


var express = require('express');
var app = express();
var request = require('request');

let  allowAccessOrigin = (req,res,next) => {
    // Setting access control allow origin headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
};

app.use(allowAccessOrigin);
/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
app.get('/',function (req, res,next) {


    var serverUrl = req.query.su;
    if (serverUrl) {
        console.log('Proxying get request to server with url: '+serverUrl);
        request
            .get(serverUrl)
            .on('error', function(err) {
                console.log('Error has occured ',err);
                next.err(err);
            }).pipe(res);
    } else {
        res.status(404).send({message: 'no server url passed'});
    }
});

app.put('/',function(req,res,next){
    var serverUrl = req.query.su;
    if (serverUrl) {
        console.log('Proxying put request to server with url: '+serverUrl);

        req.pipe(request.put(serverUrl))
            .on('error', function(err) {
                console.log('Error has occured ',err);
                next.err(err);
            }).pipe(res);
    } else {
        res.status(404).send({message: 'no server url passed'});
    }

});

app.listen(8000, function () {
    console.log('UI Proxy runs on port 8000!');
});

