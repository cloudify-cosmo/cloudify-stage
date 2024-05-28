import { get, isEmpty, isUndefined, set } from 'lodash';
import type { Request, Response, NextFunction } from 'express';
import { requestAndForwardResponse } from './RequestHandler';
import { jsonRequest } from './ManagerHandler';
import { getLogger } from './LoggerHandler';
import { getConfig } from '../config';
import { getHeadersWithAuthenticationTokenFromRequest } from '../utils';
import type { GenericErrorResponse } from '../types';

const logger = getLogger('GitHub');
const params = getConfig().app.github;
const authList = {};

interface ResponseWithData<T> extends Response<T> {
    data?: string;
}

function getSecretName(secretName: string) {
    return secretName.replace('secret(', '').replace(')', '');
}

export function pipeRequest<T>(
    req: Request,
    res: ResponseWithData<T | GenericErrorResponse>,
    next: NextFunction,
    url: string,
    isMiddleware = false
) {
    const authorization = req.header('authorization');

    logger.debug(
        `Calling pipe request to: ${url} with${isUndefined(next) ? 'out' : ''} possibility to modify response`
    );

    requestAndForwardResponse(url, res, {
        headers: authorization ? { authorization } : {},
        params: req.query,
        responseEncoding: 'utf8',
        decompress: !isMiddleware
    }).catch(err => res.status(500).send({ message: err.message }));
}

function getAuthorizationHeader(user: string, tenant?: string) {
    return get(authList, `${user}.${tenant}`, '');
}

export function setAuthorizationHeader(
    req: Request,
    _res: Response,
    next: NextFunction,
    forceFetchCredentials: boolean
) {
    const user = get(req, 'user.username', '');
    const tenant = req.header('tenant');
    const fetchCredentials = forceFetchCredentials || isEmpty(getAuthorizationHeader(user, tenant));

    if (fetchCredentials) {
        type SecretsResponse = { value: string };
        const userSecret = getSecretName(params.username);
        const passSecret = getSecretName(params.password);
        Promise.all([
            jsonRequest<SecretsResponse>(
                'GET',
                `/secrets/${userSecret}`,
                getHeadersWithAuthenticationTokenFromRequest(req, req.headers)
            ),
            jsonRequest<SecretsResponse>(
                'GET',
                `/secrets/${passSecret}`,
                getHeadersWithAuthenticationTokenFromRequest(req, req.headers)
            )
        ])
            .then(([username, password]) => {
                logger.debug([username, password]);
                const authorization = `Basic ${Buffer.from(`${username.value}:${password.value}`).toString('base64')}`;
                req.headers.authorization = authorization;
                set(authList, `${user}.${tenant}`, authorization);
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

export function addIsAuthToResponseBody<ResponseBody>(req: Request, res: ResponseWithData<ResponseBody>) {
    const json = JSON.parse(res.data!);
    json.isAuth = !isEmpty(req.header('authorization'));
    res.setHeader('content-type', 'application/json');
    res.send(json);
}
