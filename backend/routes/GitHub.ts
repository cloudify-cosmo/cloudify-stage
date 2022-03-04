import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { AxiosRequestHeaders } from 'axios';
import _ from 'lodash';
import { getConfig } from '../config';
import { jsonRequest } from '../handler/ManagerHandler';
import { getLogger } from '../handler/LoggerHandler';
import { requestAndForwardResponse } from '../handler/RequestHandler';

const router = express.Router();
const logger = getLogger('GitHub');
const params = getConfig().app.github;
const authList = {};

interface ResponseWithData extends Response {
    data?: string;
}

function getSecretName(secretName: string) {
    return secretName.replace('secret(', '').replace(')', '');
}

function pipeRequest(req: Request, res: ResponseWithData, next: NextFunction, url: string, isMiddleware = false) {
    const authorization = req.header('authorization')!;

    logger.debug(
        `Calling pipe request to: ${url} with${_.isUndefined(next) ? 'out' : ''} possibility to modify response`
    );

    requestAndForwardResponse(url, res, {
        headers: { authorization },
        params: req.query,
        responseEncoding: 'utf8',
        decompress: !isMiddleware
    }).catch(err => res.status(500).send({ message: err.message }));
}

function getAuthorizationHeader(user: string, tenant?: string) {
    return _.get(authList, `${user}.${tenant}`, '');
}

function setAuthorizationHeader(req: Request, _res: Response, next: NextFunction, forceFetchCredentials: boolean) {
    const user = _.get(req, 'user.username', '');
    const tenant = req.header('tenant');
    const fetchCredentials = forceFetchCredentials || _.isEmpty(getAuthorizationHeader(user, tenant));

    if (fetchCredentials) {
        type SecretsResponse = { value: string };
        const userSecret = getSecretName(params.username);
        const passSecret = getSecretName(params.password);
        Promise.all([
            jsonRequest<SecretsResponse>('GET', `/secrets/${userSecret}`, req.headers as AxiosRequestHeaders),
            jsonRequest<SecretsResponse>('GET', `/secrets/${passSecret}`, req.headers as AxiosRequestHeaders)
        ])
            .then(([username, password]) => {
                const authorization = `Basic ${Buffer.from(`${username.value}:${password.value}`).toString('base64')}`;
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
        req.headers.authorization = getAuthorizationHeader(user, tenant);
        next();
    }
}

function addIsAuthToResponseBody(req: Request, res: ResponseWithData) {
    const json = JSON.parse(res.data!);
    json.isAuth = !_.isEmpty(req.header('authorization'));
    res.setHeader('content-type', 'application/json');
    res.send(json);
}

router.get(
    '/search/repositories',
    (req: Request, res: Response, next: NextFunction) => {
        setAuthorizationHeader(req, res, next, true);
    },
    (req: Request, res: Response, next: NextFunction) => {
        pipeRequest(req, res, next, 'https://api.github.com/search/repositories', true);
    },
    addIsAuthToResponseBody
);

router.get(
    '/repos/:user/:repo/git/trees/master',
    (req, res, next) => {
        setAuthorizationHeader(req, res, next, false);
    },
    (req, res, next) => {
        pipeRequest(
            req,
            res,
            next,
            `https://api.github.com/repos/${req.params.user}/${req.params.repo}/git/trees/master`
        );
    }
);

// This path returns image resource so there is no point to secure that
// (if yes all credentials should be passed in the query string)
router.get('/content/:user/:repo/master/:file', (req, res, next) => {
    pipeRequest(
        req,
        res,
        next,
        `https://raw.githubusercontent.com/${req.params.user}/${req.params.repo}/master/${req.params.file}`
    );
});

export default router;
