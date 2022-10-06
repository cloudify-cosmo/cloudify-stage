import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { GetGitHubReposTreesResponse, GetGitHubSearchRepositoriesResponse } from './GitHub.types';
import { addIsAuthToResponseBody, pipeRequest, setAuthorizationHeader } from '../handler/GitHubHandler';

const router = express.Router();

router.get(
    '/search/repositories',
    (req: Request, res: Response, next: NextFunction) => {
        setAuthorizationHeader(req, res, next, true);
    },
    (req: Request, res: Response, next: NextFunction) => {
        pipeRequest<GetGitHubSearchRepositoriesResponse>(
            req,
            res,
            next,
            'https://api.github.com/search/repositories',
            true
        );
    },
    addIsAuthToResponseBody
);

router.get(
    '/repos/:user/:repo/git/trees/master',
    (req, res, next) => {
        setAuthorizationHeader(req, res, next, false);
    },
    (req, res, next) => {
        pipeRequest<GetGitHubReposTreesResponse>(
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
