/**
 * Created by pposel on 03/04/2017.
 */
var express = require('express');
var request = require('request');
var config = require('../config');

var router = express.Router();

var params = config.get().app.github;
var authorization = {"Authorization": "Basic " + new Buffer(params.username + ":" + params.password).toString('base64')};

function pipeRequest(req, res, url) {
    req.pipe(
        request.get({url: url, headers: authorization, qs: req.query})
            .on('error',function(err){res.status(500).send({message: err.message})})
    ).pipe(res);
}

router.get('/users/:user/repos',function (req, res, next) {
    pipeRequest(req, res, "https://api.github.com/users/" + req.params.user + "/repos");
});

router.get('/search/repositories',function (req, res, next) {
    pipeRequest(req, res, "https://api.github.com/search/repositories");
});

router.get('/repos/:user/:repo/git/trees/master',function (req, res, next) {
    pipeRequest(req, res, "https://api.github.com/repos/" + req.params.user + "/" + req.params.repo + "/git/trees/master");
});

router.get('/content/:user/:repo/master/:file',function (req, res, next) {
    pipeRequest(req, res, "https://raw.githubusercontent.com/" + req.params.user + "/" + req.params.repo + "/master/" + req.params.file);
});

module.exports = router;
