/**
 * Created by pposel on 03/04/2017.
 */
const express = require('express');
const request = require('request');
const passport = require('passport');
const _ = require('lodash');
const config = require('../config');
const ManagerHandler = require('../handler/ManagerHandler');

const router = express.Router();
const logger = require('../handler/LoggerHandler').getLogger('GitHub');

const params = config.get().app.github;
const authList = {};

function _getSecretName(secretName) {
    return secretName.replace('secret(', '').replace(')', '');
}

function _pipeRequest(req, res, next, url, isMiddleware) {
    const authorization = req.header('authorization');

    logger.debug(
        `Calling pipe request to: ${url} with${_.isUndefined(next) ? 'out' : ''} possibility to modify response`
    );
    if (isMiddleware) {
        let data = '';
        req.pipe(
            request
                .get({ url, headers: authorization, qs: req.query, gzip: true, encoding: 'utf8' })
                .on('data', function(chunk) {
                    data += chunk;
                })
                .on('end', function() {
                    res.data = data;
                    next();
                })
                .on('error', function(err) {
                    res.status(500).send({ message: err.message });
                })
        );
    } else {
        req.pipe(
            request.get({ url, headers: authorization, qs: req.query }).on('error', function(err) {
                res.status(500).send({ message: err.message });
            })
        ).pipe(res);
    }
}

function _getAuthorizationHeader(user, tenant) {
    return _.get(authList, `${user}.${tenant}`, '');
}

function _setAuthorizationHeader(req, res, next, fetchCredentials) {
    const user = _.get(req, 'user.username', '');
    const tenant = req.header('tenant');
    var fetchCredentials = fetchCredentials || _.isEmpty(_getAuthorizationHeader(user, tenant));

    if (fetchCredentials) {
        const userSecret = _getSecretName(params.username);
        const passSecret = _getSecretName(params.password);
        Promise.all([
            ManagerHandler.jsonRequest('GET', `/secrets/${userSecret}`, req.headers),
            ManagerHandler.jsonRequest('GET', `/secrets/${passSecret}`, req.headers)
        ])
            .then(data => {
                const username = data[0];
                const password = data[1];
                const authorization = `Basic ${new Buffer(`${username.value}:${password.value}`).toString('base64')}`;
                req.headers.authorization = authorization;
                _.set(authList, `${user}.${tenant}`, authorization);
                logger.debug('Setting authorization header from fetched credentials. GitHub user:', username.value);
                next();
            })
            .catch(error => {
                logger.debug(
                    "Cannot set authorization header for GitHub user. GitHub's username and password not set properly in secrets. Error:",
                    error
                );
                next();
            });
    } else {
        logger.debug('Setting authorization header from cached data.');
        req.headers.authorization = _getAuthorizationHeader(user, tenant);
        next();
    }
}

function addIsAuthToResponseBody(req, res, next) {
    const json = JSON.parse(res.data);
    json.isAuth = !_.isEmpty(req.header('authorization'));
    res.setHeader('content-type', 'application/json');
    res.send(json);
}

router.get(
    '/search/repositories',
    passport.authenticate('token', { session: false }),
    function(req, res, next) {
        _setAuthorizationHeader(req, res, next, true);
    },
    function(req, res, next) {
        _pipeRequest(req, res, next, 'https://api.github.com/search/repositories', true);
    },
    addIsAuthToResponseBody
);

router.get(
    '/repos/:user/:repo/git/trees/master',
    passport.authenticate('token', { session: false }),
    function(req, res, next) {
        _setAuthorizationHeader(req, res, next, false);
    },
    function(req, res, next) {
        _pipeRequest(
            req,
            res,
            next,
            `https://api.github.com/repos/${req.params.user}/${req.params.repo}/git/trees/master`
        );
    }
);

// This path returns image resource so there is no point to secure that
// (if yes all credentials should be passed in the query string)
router.get('/content/:user/:repo/master/:file', function(req, res, next) {
    _pipeRequest(
        req,
        res,
        next,
        `https://raw.githubusercontent.com/${req.params.user}/${req.params.repo}/master/${req.params.file}`
    );
});

module.exports = router;
